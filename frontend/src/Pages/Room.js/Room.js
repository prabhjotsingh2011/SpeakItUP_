import React, { useState,useEffect } from 'react'
import { useParams,useHistory } from 'react-router-dom'
import { useWebRTC } from '../../hooks/useWebRTC'
import { useSelector } from 'react-redux'
import styles from './Room.module.css'
import { getRoom } from '../../http'

const Room = () => {
    const { id: roomId } = useParams()
    const user = useSelector(state => state.auth.user)

    const { clients, provideRef } = useWebRTC(roomId, user);

    const history=useHistory()
    const [room,setRoom]=useState(null)
    const handleManualLeave=()=>{
            
            history.push('/rooms')
    }

    useEffect(()=>{
        const fetchRoom=async()=>{
            const {data} =await getRoom(roomId)
            setRoom(data[0])
        };
        fetchRoom()
    },[roomId])

    return (
        <div>
            <div className='container'>
                <button className={styles.goBack} onClick={handleManualLeave}>
                    <img src='/images/arrow1.png' alt="arrow"  />
                    <span>All VoiceRooms</span>
                </button>
            </div>

            <div className={styles.clientsWrap}>
                <div className={styles.header}>
                    <h2 className={styles.topic}>{room?.topic} </h2>
                    <div className={styles.actions}>
                        <button className={styles.actionBtn}> 🖐</button>
                        <button onClick={handleManualLeave} className={styles.actionBtn}>
                            <img src="/images/palm1.png" alt="palm" />
                            <span>Leave Quietly</span>
                        </button>
                    </div>
                </div>
                <div className={styles.clientsList}>

                    {
                        clients.map(client => {
                            return(

                                <div key={client.id} className={styles.userHead}>
                                    <audio
                                        ref={(instance) => provideRef(instance, client.id)}
                                        // controls
                                        autoPlay
                                    ></audio>

                                    <img className={styles.userAvatar} src={client.avatar} alt="avatar" />

                                    <button className={styles.micBtn}>
                                        {/* <img
                                            src="/images/mic.png"
                                            alt="mic-icon"
                                        /> */}
                                        <img
                                            src="/images/mic_off.png"
                                            alt="mic-mute-icon"
                                        />
                                    </button>
                                    <h4>{client.name}</h4>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    )
}

export default Room
