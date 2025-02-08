import React, { useEffect } from 'react'
import { useSocket } from '../providers/socket'

const Room = () => {
    const socket = useSocket();

    const handleNewUser = (data) => {
        const { email } = data;
        console.log(email, 'connected');
    };

    useEffect(() => {
        if (!socket) return; // Ensure socket is available

        const handleUserJoined = (data) => {
            handleNewUser(data);
        };

        socket.on('user-joined', handleUserJoined);

        return () => {
            socket.off('user-joined', handleUserJoined); // Cleanup to prevent duplicate listeners
        };
    }, [socket]);

    return <div>Room</div>;
};

export default Room;
