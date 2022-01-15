import { useRef, useEffect, useCallback } from "react";
import { socketInit } from "../socket";
// import socketInit from '../socket/index'
import { useStateWithCallback } from "./useStateWithCallback"
import {ACTIONS} from '../actions'
import freeice from 'freeice'

const users = [
    {
        id: 1,
        name: 'prabhjot ',
    },
    {
        id: 2,
        name: 'Aman ',

    },
]

export const useWebRTC = (roomId, user) => {

    
    //here we want whenever we update setclient we want a callback to be called after update.
    const [clients, setClients] = useStateWithCallback([]);
    const audioElements = useRef({})

    //connection={
    //      socketId: connections object
    // }
    const connections = useRef({})

    const localMediaStream = useRef(null);
    const socket=useRef(null);

    useEffect(()=>{
        socket.current=socketInit()
    },[])

    
    const addNewClient = useCallback(
        (newClient, cb) => {
            const lookingFor = clients.find((client) => client.id === newClient.id)

            if (lookingFor === undefined) {
                setClients((existingClients) => [...existingClients, newClient], cb)
            }
        },
        [clients, setClients]
    )

    
    useEffect(() => {
        
        const startCaputure = async () => {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
            })
        }
        startCaputure().then(() => {
            addNewClient(user, () => {
                const localElement = audioElements.current[user.id];
                
                if (localElement) {
                    localElement.volume = 0;
                    localElement.srcObject = localMediaStream.current
                }

                //send offer using socket.io
                socket.current.emit(ACTIONS.JOIN,{roomId,user})
                
            })
        })
    }, []);
    

    const handleNewPeer=async({peerId,createOffer,user: remoteUser})=>{
        //if already connected give warning 
        if(peerId in connections.current) return alert('you are already inside the room')

         connections.current[peerId]=new RTCPeerConnection({
            iceServers:freeice()
         })

        //handle new icecandiadte 
        connections.current[peerId].onicecandidate=(event)=> {
            socket.current.emit(ACTIONS.RELAY_ICE,{
                peerId,
                icecandidate:event.candidate
            })
        }

        //handle ontrack on this connection
        connections.current[peerId].ontrack=({streams:[remoteStream]})=>{
            addNewClient(remoteUser,()=>{
                if(audioElements.current[remoteUser.id]){
                    audioElements.current[remoteUser.id].srcObject=remoteStream
                }
                else{
                    let settled =false;
                    const interval=setInterval(()=>{
                        if(audioElements.current[remoteUser.id]){
                            audioElements.current[remoteUser.id].srcObject=remoteStream

                            settled=true;
                            if(settled){
                                clearInterval(interval)
                            }
                        }
                    },1000)
                }
            })
        }

        //add local track to remote connections
        localMediaStream.current.getTracks().forEach(track => {
            connections.current[peerId].addTrack(track,localMediaStream.current)
        })


        //create offer
        if(createOffer){
            const offer=await connections.current[peerId].createOffer();


            //send offer to another client 
            socket.current.emit(ACTIONS.RELAY_SDP,{
                peerId,
                sessionDescription:offer
            })
        }
    }

    useEffect(()=>{
        socket.current.on(ACTIONS.ADD_PEER,handleNewPeer)
    },[])
    
    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance
    }

    return { clients, provideRef }
}