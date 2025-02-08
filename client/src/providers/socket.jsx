import React from 'react';
import { io } from 'socket.io-client';

const SocketContext = React.createContext(null);


export const useSocket = () => {
    return React.useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {
    const socket = React.useMemo(() => io('http://localhost:5001'))
    return (
        <SocketContext.Provider value={socket}>
            {children}
        </SocketContext.Provider>
    )
};