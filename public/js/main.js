import store from './store.js';
import ui from './ui.js';
import socketHandler from './socketHandler.js';

const nameInput = document.querySelector('.introduction_page_name_input');
let roomSelect = document.getElementById('room_select');


nameInput.addEventListener('keyup', (event) => {
    store.setUserName(event.target.value);
});

roomSelect.addEventListener('change', event => {
    store.setRoomId(event.target.value);
    console.log('room changed');
    console.log(store.getRoomId());
});

const chatPageButton = document.getElementById('enter_chats_button');
chatPageButton.addEventListener('click', () => {
    ui.gotoChatPage();
    socketHandler.connectToSocketIoServer();
});