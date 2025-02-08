const express = require('express');
const bodyParser = require('body-parser');
const {Server} = require('socket.io');
const cors = require('cors');


const app = express();
const io = new Server({
    cors: true
});

app.use(cors());
app.use(bodyParser.json());

const emailToSocketMapping = new Map();
const socketToEmailMapping = new Map();


io.on('connection', (socket) => {
    console.log('New User connected');

    socket.on('join-room', (data) => {
        console.log(data);
        const { roomId, email } = data;

        console.log('User:', email, 'joined Room:', roomId);

        // Store socket ID for user
        emailToSocketMapping.set(email, socket.id);
        socketToEmailMapping.set(socket.id, email);

        // Join the room
        socket.join(roomId);

        // Notify everyone **except the sender** that a new user joined
        socket.broadcast.to(roomId).emit('user-joined', data);

        // Notify the sender that they have successfully joined
        socket.emit('joined-room', roomId);

        // Notify everyone in the room that a new user connected
        io.to(roomId).emit('user-connected', email);
    });

    socket.on('call-user', (data) => {
        const { email, offer } = data;
        const fromEmail = socketToEmailMapping.get(socket.id);
        const socketId = emailToSocketMapping.get(email);
        socket.to(socketId).emit('incoming-call', { fromEmail, offer });
    });

    socket.on('call-accepted', (data) => {
        const { email, answer } = data;
        const socketId = emailToSocketMapping.get(email);
        socket.to(socketId).emit('call-accepted', { answer });
    });
});


app.listen(5000, () => {
  console.log('Server is running on port 5000');
});

io.listen(5001, () => {
  console.log('Socket server is running on port 5001');
});
