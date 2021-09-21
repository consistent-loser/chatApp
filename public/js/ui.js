import store from './store.js';
import elements from './elements.js';
import socketHandler from './socketHandler.js';
const gotoChatPage = () => {
    const introductionPage = document.querySelector('.introduction_page');
    const chatsPage = document.querySelector('.chat_page');

    introductionPage.classList.add('display_none');
    chatsPage.classList.remove('display_none');
    chatsPage.classList.add('display_flex');

    const userNameLabel = document.querySelector('.username_label');
    userNameLabel.innerHTML = store.getUserName();

    createGroupChatbox();
    createRoomChatbox();
}

const chatboxId = 'group-chat-chatbox';
const chatboxMessagesId = 'group-chat-messages';
const chatboxInputId = 'group-chat-input';

const createGroupChatbox = () => {
    const data = {
        chatboxLabel: 'Group Chat',
        chatboxId,
        chatboxMessagesId,
        chatboxInputId
    }
    const chatbox = elements.getChatbox(data);
    const chatboxesContainer = document.querySelector('.chatboxes_container');
    chatboxesContainer.appendChild(chatbox);

    const newMessageInput = document.getElementById(chatboxInputId);
    newMessageInput.addEventListener('keydown', (event) => {
        const key = event.key;

        if (key === 'Enter') {
            const author = store.getUserName();
            const messageContent = event.target.value;
            socketHandler.sendGroupchatMessage(author, messageContent);
            newMessageInput.value = "";
        }
    });

}

const appendGroupchatMessage = (data) => {
    const groupchatMessageBoxContainer = document.getElementById(chatboxMessagesId);
    const chatMessage = elements.getGroupchatMessage(data);
    groupchatMessageBoxContainer.appendChild(chatMessage);
}
const updateActiveChatboxes = (data) => {
    const userSocketId = store.getUserSocketId();
    const connectedPeers = data.connectedpeers;

    connectedPeers.forEach((peer) => {
        const activeChatboxes = store.getActiveChatboxes();
        const activeChatbox = activeChatboxes.find(chatbox => peer.socketId === chatbox.socketId);

        if (!activeChatbox && peer.socketId !== userSocketId) {
            createNewUserChatbox(peer);
        }

    });
}

const createNewUserChatbox = (peer) => {
    const chatboxId = peer.socketId;
    const chatboxMessagesId = `${peer.socketId}-messages`;
    const chatboxInputId = `${peer.socketId}-input`;
    const chatboxLabel = peer.userName;

    const data = {
        chatboxId,
        chatboxMessagesId,
        chatboxInputId,
        chatboxLabel
    }

    const chatbox = elements.getChatbox(data);

    const chatboxContainer = document.querySelector('.chatboxes_container');
    chatboxContainer.appendChild(chatbox);

    //register user event to send message to another user

    const newMessageInput = document.getElementById(chatboxInputId);
    newMessageInput.addEventListener('keydown', event => {
        const key = event.key;

        if (key === 'Enter') {
            const author = store.getUserName();
            const messageContent = event.target.value;
            const receiverSocketId = peer.socketId;
            const authorSocketId = store.getUserSocketId();

            const data = {
                author,
                messageContent,
                receiverSocketId,
                authorSocketId
            }

            socketHandler.sendDirectMessage(data);
            newMessageInput.value = '';
        }
    });

    let activeChatboxes = store.getActiveChatboxes();
    const newActiveChatboxes = [...activeChatboxes, peer];
    store.setActiveChatboxes(newActiveChatboxes);
}

const appendDirectChildMessage = (messageData) => {
    const { authorSocketId, author, messageContent, receiverSocketId, isAuthor } = messageData;
    // console.log(authorSocketId, author, messageContent, receiverSocketId, isAuthor);
    const messageContainer = isAuthor ?
        document.getElementById(`${receiverSocketId}-messages`) :
        document.getElementById(`${authorSocketId}-messages`);

    if (messageContainer) {
        const data = {
            author,
            messageContent,
            alignRight: isAuthor ? true : false
        }

        const message = elements.getDirectChatMessage(data);
        messageContainer.appendChild(message);
    }
}

const removeChatboxOfDisconnectedPeer = (data) => {
    const { socketIdOfDisconnectedPeer } = data;

    //remove peer from activeUsers

    const activeChatboxes = store.getActiveChatboxes();
    const newActiveChatboxes = activeChatboxes.filter(chatbox => {
        return socketIdOfDisconnectedPeer !== chatbox.socketId;
    });
    store.setActiveChatboxes(newActiveChatboxes);

    //remove chatbox from DOM

    const chatbox = document.getElementById(socketIdOfDisconnectedPeer);
    if (chatbox) {
        chatbox.parentElement.removeChild(chatbox);
    }

}

const createRoomChatbox = () => {
    const chatboxLabel = store.getRoomId();
    const chatboxId = store.getRoomId();
    const chatboxMessagesId = `${store.getRoomId()}-messages`;
    const chatboxInputId = `${store.getRoomId()}-input`;

    const data = {
        chatboxLabel,
        chatboxId,
        chatboxMessagesId,
        chatboxInputId
    }
    const chatbox = elements.getChatbox(data);
    const chatboxesContainer = document.querySelector('.chatboxes_container');
    chatboxesContainer.appendChild(chatbox);

    // event to send message to the room
    const newMessageInput = document.getElementById(chatboxInputId);
    newMessageInput.addEventListener('keydown', event => {
        const key = event.key;

        if (key === 'Enter') {
            const author = store.getUserName();
            const messageContent = event.target.value;
            const authorSocketId = store.getUserSocketId();
            const roomId = store.getRoomId();
            const data = {
                author,
                messageContent,
                authorSocketId,
                roomId
            }

            socketHandler.sendRoomMessage(data);
            newMessageInput.value = '';
        }
    });
}

const appendRoomChatMessage = (data) => {
    const { roomId } = data;
    const roomchatMessageBoxContainer = document.getElementById(`${roomId}-messages`);
    const roomchatMessage = elements.getRoomchatMessage(data);
    roomchatMessageBoxContainer.appendChild(roomchatMessage);
}

export default {
    gotoChatPage,
    appendGroupchatMessage,
    updateActiveChatboxes,
    appendDirectChildMessage,
    removeChatboxOfDisconnectedPeer,
    appendRoomChatMessage
};