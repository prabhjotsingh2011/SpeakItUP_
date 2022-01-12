import { useRef, useEffect, useCallback } from "react";
import { socketInit } from "../socket";
// import socketInit from '../socket/index'
import { useStateWithCallback } from "./useStateWithCallback"
import {ACTIONS} from '../actions'

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
    const connections = useRef({})
    const localMediaStream = useRef(null);
    const socket=useRef(null);

    useEffect(()=>{
        socket.current=socketInit()
    },[])
    const addNewClients = useCallback(
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
            addNewClients(user, () => {
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
    
    
    
        const provideRef = (instance, userId) => {
            audioElements.current[userId] = instance
        }

    return { clients, provideRef }
}