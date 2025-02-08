import React, { useEffect, useState } from 'react'
import { useSocket } from '../providers/socket'
import { useNavigate } from 'react-router-dom';


const Home = () => {
    const socket = useSocket();
    const navigate = useNavigate();
    const [email, setEmail] = useState('');
    const [room, setRoom] = useState('');

    const handleRoomJoin = (roomId) => {
        console.log('Joined room: ', roomId);
        navigate(`/room/${roomId}`);
    }

    useEffect(() => {
        socket.on('joined-room', (roomId) => {
            handleRoomJoin(roomId);
        })

        return () => {
            socket.off('joined-room', handleRoomJoin);
        }
    }, [socket]);



    const handleJoinRoom = () => {
        socket.emit('join-room', {email, roomId: room});
    }

    return (
        <div className='flex items-center justify-center h-screen bg-blue-500'>
            <form onSubmit={(e) => e.preventDefault()} className="text-2xl font-bold flex flex-col gap-4 items-center justify-center bg-black bg-opacity-50 p-4 rounded-lg">
                <input onChange={(e) => setEmail(e.target.value)} value={email} type="email" name="email" id="email" placeholder='Enter your email' className='bg-white p-3 rounded-md '/>
                <input onChange={(e) => setRoom(e.target.value)} value={room} type="text" name="room" id="room" placeholder='Enter Room ID' className='bg-white p-3 rounded-md '/>
                <button onClick={handleJoinRoom} className="cursor-pointer bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Submit</button>
            </form>
        </div>
    )
}

export default Home