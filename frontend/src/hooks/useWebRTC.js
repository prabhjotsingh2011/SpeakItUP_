import { useRef, useEffect, useCallback } from "react";
import { socketInit } from "../socket";
// import socketInit from '../socket/index'
import { useStateWithCallback } from "./useStateWithCallback"
import { ACTIONS } from '../actions'
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
    const audioElements = useRef({})  //instace the audio tag 

    //connection={
    //      socketId: connections object
    // }
    const connections = useRef({})

    const localMediaStream = useRef(null); // storing the instance of media stream for audio 
    const socket = useRef(null);

    const clientsRef = useRef([]);

    useEffect(() => {
        socket.current = socketInit()
    }, [])


    const addNewClient = useCallback(
        (newClient, cb) => {
            const lookingFor = clients.find((client) => client.id === newClient.id)

            if (lookingFor === undefined) {
                setClients((existingClients) => [...existingClients, newClient], cb)
            }
        },
        [clients, setClients]
    )


    //capture media
    useEffect(() => {

        const startCaputure = async () => {
            localMediaStream.current = await navigator.mediaDevices.getUserMedia({
                audio: true,
            })
        }
        startCaputure().then(() => {
            addNewClient({ ...user, muted: true }, () => {
                const localElement = audioElements.current[user.id];

                if (localElement) {
                    localElement.volume = 0;
                    localElement.srcObject = localMediaStream.current
                }

                //send offer using socket.io
                socket.current.emit(ACTIONS.JOIN, { roomId, user })

            })
        })
        //leaving the room 

        return () => {
            localMediaStream.current.getTracks().forEach(track => track.stop());

            socket.current.emit(ACTIONS.LEAVE, { roomId })
        }
    }, []);


    const handleNewPeer = async ({ peerId, createOffer, user: remoteUser }) => {
        //if already connected give warning                                
        if (peerId in connections.current) return alert('you are already inside the room')

        connections.current[peerId] = new RTCPeerConnection({
            iceServers: freeice()
        })

        //handle new icecandiadte 
        connections.current[peerId].onicecandidate = (event) => {
            socket.current.emit(ACTIONS.RELAY_ICE, {
                peerId,
                icecandidate: event.candidate
            })
        }

        //handle ontrack on this connection           
        connections.current[peerId].ontrack = ({ streams: [remoteStream] }) => {
            addNewClient({ ...remoteUser, muted: true }, () => {
                if (audioElements.current[remoteUser.id]) {
                    audioElements.current[remoteUser.id].srcObject = remoteStream
                }
                else {
                    let settled = false;
                    const interval = setInterval(() => {
                        if (audioElements.current[remoteUser.id]) {
                            audioElements.current[remoteUser.id].srcObject = remoteStream

                            settled = true;
                            if (settled) {
                                clearInterval(interval)
                            }
                        }
                    }, 1000)
                }
            })
        }

        //add local track to remote connections
        localMediaStream.current.getTracks().forEach(track => {
            connections.current[peerId].addTrack(track, localMediaStream.current)
        })


        //create offer
        if (createOffer) {
            const offer = await connections.current[peerId].createOffer();

            await connections.current[peerId].setLocalDescription(offer)

            //send offer to another client 
            socket.current.emit(ACTIONS.RELAY_SDP, {
                peerId,
                sessionDescription: offer
            })
        }
    }

    useEffect(() => {
        socket.current.on(ACTIONS.ADD_PEER, handleNewPeer)

        return () => {
            socket.current.off(ACTIONS.ADD_PEER)
        }
    }, [])


    //handle ice cadidate
    useEffect(() => {
        socket.current.on(ACTIONS.ICE_CANDIDATE, ({ peerId, icecandidate }) => {
            if (icecandidate) {
                connections.current[peerId].addIceCandidate(icecandidate);
            }
        })

        return () => {
            socket.current.off(ACTIONS.ICE_CANDIDATE);
        }
    })

    //handle SDP or offer
    useEffect(() => {
        const handleRemoteSDP = async ({ peerId, sessionDescription: remoteSessionDescrition }) => {

            try {

                if (!remoteSessionDescrition) throw Error("error");

                connections.current[peerId].setRemoteDescription(
                    new RTCSessionDescription(remoteSessionDescrition)
                )

                connections.current[peerId].setRemoteDescription(remoteSessionDescrition)

                // if sessionDecription is type of offer the create Answer
                if (remoteSessionDescrition.type === 'offer') {
                    const connection = connections.current[peerId];

                    const answer = await connection.createAnswer()

                    connection.setLocalDescription(answer);

                    socket.current.emit(ACTIONS.RELAY_SDP, {
                        peerId,
                        sessionDescription: answer
                    })
                }

            } catch (error) {
                // console.log("remoteSessionDescrition is undefined ")
            }








        }

        socket.current.on(ACTIONS.SESSION_DESCRIPTION, handleRemoteSDP)

        return () => {
            socket.current.off(ACTIONS.SESSION_DESCRIPTION);
        }
    }, [])

    // handle remove peer 
    useEffect(() => {
        const handleRemovePeer = async ({ peerId, userId }) => {
            if (connections.current[peerId]) {
                connections.current[peerId].close();
            }

            delete connections.current[peerId]
            delete audioElements.current[peerId]
            setClients((list) => list.filter(client => client.id !== userId))
        }
        socket.current.on(ACTIONS.REMOVE_PEER, handleRemovePeer)

        return () => {
            socket.current.off(ACTIONS.REMOVE_PEER)
        }
    }, [])

    useEffect(() => {
        clientsRef.current=clients
    },[clients])

    //listen for mute and unmute
    useEffect(() => {
        socket.current.on(ACTIONS.MUTE, ({peerId,userId})=>{
            setMute(true,userId);
        })
        socket.current.on(ACTIONS.UNMUTE, ({peerId,userId})=>{
            setMute(false,userId);
        })
        
        
        const setMute = (mute,userId) => {
            const clientIdx=clientsRef.current.map((client) => client.id).indexOf(userId);

            console.log('====================================');
            console.log('idx', clientIdx);
            console.log('====================================');

            const connectedClients=JSON.parse(
                JSON.stringify(clientsRef.current)
            )


            if(clientIdx > -1){
                connectedClients[clientIdx].muted=mute
                setClients(connectedClients)
            } 
        }
    },[clients])
    const provideRef = (instance, userId) => {
        audioElements.current[userId] = instance
    }


    const handleMute = (isMute, userId) => {
        console.log("mute", isMute)
        let settled = false;
        let interval = setInterval(() => {

            if (localMediaStream.current) {

                localMediaStream.current.getTracks()[0].enabled = !isMute

                if (isMute) {
                    socket.current.emit(ACTIONS.MUTE, { roomId, userId })
                }
                else {
                    socket.current.emit(ACTIONS.UNMUTE, { roomId, userId })
                }

                settled=true;
            }
            if(settled) {
                clearInterval(interval)
            }
        }, 200)

    }




    return { clients, provideRef, handleMute }
}