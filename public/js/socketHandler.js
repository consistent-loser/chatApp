import store from './store.js';
import ui from './ui.js';

let socket = null;
const connectToSocketIoServer = () => {
    socket = io('/');
    socket.on('connect', () => {
        store.setUserSocketId(socket.id);
        console.log(`connected successfully ${socket.id}`);
        registerActiveSession();
    });

    socket.on('group-chat-message', data => {
        ui.appendGroupchatMessage(data);
    });

    socket.on('active-peers', data => {
        ui.updateActiveChatboxes(data);
    });

    socket.on('direct-message', data => {
        ui.appendDirectChildMessage(data);
    });

    socket.on('room-message', data => {
        ui.appendRoomChatMessage(data);
    })

    socket.on('peer-disconnected', data => {
        ui.removeChatboxOfDisconnectedPeer(data);
    });
}

const registerActiveSession = () => {
    const userData = {
        userName: store.getUserName(),
        roomId: store.getRoomId(),
    }

    socket.emit('register-new-user', userData);
}

const sendGroupchatMessage = (author, messageContent) => {
    const messageData = {
        author,
        messageContent
    }

    socket.emit('group-chat-message', messageData);
}

const sendDirectMessage = (data) => {
    socket.emit('direct-message', data);
}

const sendRoomMessage = (data) => {
    socket.emit('room-message', data);
}

export default {
    connectToSocketIoServer,
    sendGroupchatMessage,
    sendDirectMessage,
    sendRoomMessage,
};