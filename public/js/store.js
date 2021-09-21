let username;
let socketId;
let activeChatboxes = [];
let userSocketId;
let roomId = 'Room1';
const getUserName = () => {
    return username;
}
const setUserName = (name) => {
    username = name;
    console.log(username);
}

const getSocketId = () => {
    return socketId;
}

const setSocketId = (id) => {
    socketId = id;
}

const getActiveChatboxes = () => {
    return activeChatboxes;
}
const setActiveChatboxes = (chatboxes) => {
    activeChatboxes = chatboxes;
}

const getUserSocketId = () => {
    return userSocketId;
}

const setUserSocketId = (id) => {
    userSocketId = id;
}

const getRoomId = () => {
    return roomId;
}

const setRoomId = (id) => {
    roomId = id;
}

export default {
    getUserName,
    setUserName,
    getSocketId,
    setSocketId,
    getActiveChatboxes,
    setActiveChatboxes,
    getUserSocketId,
    setUserSocketId,
    getRoomId,
    setRoomId
};