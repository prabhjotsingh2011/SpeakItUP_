import React,{useState,useEffect} from 'react'
import AddRoomModel from '../../components/AddRoomModel/AddRoomModel'
import RoomCard from '../../components/roomCard/RoomCard'
import { getAllRooms } from '../../http'
import styles from './Rooms.module.css'
// const rooms = [
//     {
//         id: 1,
//         topic: 'Which framework best for frontend ?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
//     {
//         id: 3,
//         topic: 'What’s new in machine learning?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
//     {
//         id: 4,
//         topic: 'Why people use stack overflow?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
//     {
//         id: 5,
//         topic: 'Artificial inteligence is the future?',
//         speakers: [
//             {
//                 id: 1,
//                 name: 'John Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//             {
//                 id: 2,
//                 name: 'Jane Doe',
//                 avatar: '/images/monkey-avatar.png',
//             },
//         ],
//         totalPeople: 40,
//     },
// ];


const Rooms = () => {
    const [showModel, setShowModel] = useState(false);
    const [rooms, setRooms] = useState([]);

    useEffect(() => {
        const fetchRooms=async()=>{
            const {data} =await getAllRooms();
            // console.log(data);
            setRooms(data);
        }
        fetchRooms();
    }, []);

    const openModel=()=>{
        
        setShowModel(true);
    }
    const onClose=()=>{
        setShowModel(false);
    }
    return (
        <>
            <div className="container">
                <div className={styles.roomHeader}>
                    <div className={styles.left}>
                        <span className={styles.heading}>All Voice Rooms</span>
                        <div className={styles.searchbox}>
                            <img src="/images/serach-icon.png" alt="search" srcset="" />
                            <input type="text" className={styles.serachInput}/>
                        </div> 
                    </div>
                    <div className={styles.right}>
                        <button onClick={openModel} className={styles.startRoomButton}>
                            <img src="/images/add-room.png" alt="add-room" />
                            <span>start a room</span>
                        </button>
                    </div>
                </div>

                <div className={styles.roomList} >
                        {rooms.map((room)=>(
                            <RoomCard key={room.id} room={room}/>
                        ))}
                </div>
            </div>
            {
                showModel && <AddRoomModel onClose={onClose}/>
            }
        </>
    )
}

export default Rooms
