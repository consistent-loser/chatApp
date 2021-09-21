const express = require('express');
const http = require('http');
const app = express();

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

app.use(express.static('public'));
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

const io = require('socket.io')(server);
let connectedpeers = [];

io.on('connection', (socket) => {
    //console.log(socket.id);
    socket.on('group-chat-message', data => {
        console.log("Group message");
        console.log(data);
        io.emit('group-chat-message', data);
    });

    socket.on('register-new-user', userData => {
        const { userName, roomId } = userData;
        const newPeer = {
            userName,
            socketId: socket.id,
            roomId
        }
        //Join Socket.io room
        socket.join(roomId);

        connectedpeers = [...connectedpeers, newPeer];
        broadcastConnectedPeers();
        //console.log(connectedpeers);
    });

    socket.on('direct-message', data => {
        const { receiverSocketId } = data;
        const connectedpeer = connectedpeers.find(peer => {
            return peer.socketId === receiverSocketId;
        });

        if (connectedpeer) {
            const authorData = {
                ...data,
                isAuthor: true
            }
            //emit message to ourselves
            socket.emit('direct-message', authorData);
            //emit message to he receiver
            io.to(receiverSocketId).emit('direct-message', data);
        }
        else {
            console.log("failed to send message");
        }

    });

    socket.on('room-message', data => {
        const { roomId } = data;
        io.to(roomId).emit('room-message', data);
    })

    socket.on('disconnect', () => {
        connectedpeers = connectedpeers.filter((peer) => peer.socketId != socket.id);
        // console.log(connectedpeers);
        broadcastConnectedPeers();

        const data = {
            socketIdOfDisconnectedPeer: socket.id
        }

        io.emit('peer-disconnected', data);
    });


});

const broadcastConnectedPeers = () => {
    const data = {
        connectedpeers
    }
    io.emit('active-peers', data);
}

server.listen(PORT, () => {
    console.log(`Listenning to port ${PORT}`);
});