import React,{useState} from 'react'
import styles from  './AddRoomModel.module.css'
import TextInput from '../shared/textInput/TextInput'
import {createRoom as create} from '../../http/index'
import { useHistory } from 'react-router'
const AddRoomModel = ({onClose}) => {
    const [roomType, setRoomType] = useState('open');
    const [topic, setTopic] = useState('')
    const history=useHistory();

const createRoom=async()=>{
    ///server call
    try {
        if(!topic) return ;
        const  {data} = await create({topic,roomType})
        history.push(`/room/${data.id}`)
        
    } catch (err) {
        console.log(err.message);
    }
}

    return (
        <div className={styles.modelMask}>
            <div className={styles.modelBody}>
            <button onClick={onClose} className={styles.closeButton}>
                <img src="/images/close.png" alt="" />
            </button>
                <div className={styles.modelHeader}>
                    <h3 className={styles.heading}>Enter the Topic to be discussed</h3>
                    <TextInput fullwidth="true" value={topic} onChange={(e)=> setTopic(e.target.value)} />
                    <h2 className={styles.subHeadig}>Room Types</h2>
                    <div className={styles.roomsType}>
                        <div onClick={()=> setRoomType('open')} className={`${styles.typeBox} ${roomType === 'open' ? styles.active:''}`}>
                                <img src="/images/Globe.png" alt="" />
                                <span>Open</span>
                        </div>
                        <div onClick={()=> setRoomType('social')} className={`${styles.typeBox} ${roomType=== 'social' ? styles.active:" "}`}>
                                <img src="/images/Users.png" alt="" />
                                <span>Social</span>
                        </div>
                        <div onClick={()=> setRoomType('private')} className={`${styles.typeBox} ${roomType=== 'private' ? styles.active:" "}`}>
                                <img src="/images/Lock.png" alt="" />
                                <span>Private</span>
                        </div>
                    </div>
                </div>
                <div className={styles.modelFooter}>
                    <h2>start a room, open to everyone</h2>
                    <button className={styles.footerButton}>
                    <img src="/images/celebration.png" alt="" />
                    <span onClick={createRoom}>Let's Go</span>
                    </button>
                </div>

            </div>
        </div>
    )
}

export default AddRoomModel
