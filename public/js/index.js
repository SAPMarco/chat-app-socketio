/**
 * Message Types enum
 */
const messageTypes = { 
    LEFT: 'left',
    RIGHT: 'right',
    LOGIN: 'login'
};

/**
 * Get chatting elements 
 */
const chatWindow = document.getElementById('chat');
const messagesList = document.getElementById('messagesList');
const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');

/**
 * Get login elements
 */
let username = '';
const usernameInput = document.getElementById('usernameInput');
const loginButton = document.getElementById('loginButton');
const loginWindow = document.getElementById('login');

/**
 * Initiate WebSocket connection via Socket.io 
 * (brought in by CDN via index.html script-tag)
 */
const socket = io();

socket.on('message', message => {
    if(message.type !== messageTypes.LOGIN){
        if(message.author === username){
            message.type = messageTypes.RIGHT;
        } else {
            message.type = messageTypes.LEFT;
        }
    }
    
    messages.push(message);
    displayMessages();
    
    //being automatically scrolled to the bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
});

/**
 * Application state - 1 item of the array: 
 * {author, date, content, type} 
 */
const messages = [];

/**
 * Take in a message object and 
 * return a corresponding HTML
 */
createMessageHTML = message => {
    if(message.type === messageTypes.LOGIN){
        return `
            <p class="secondary-text text-center mb-2">${message.author} has joined the chat ...</p>
        `
    } 

    return `
        <div class="message ${message.type === messageTypes.LEFT ? 'message-left' : 'message-right'}">
            <div id="message-details" class="flex" >
                <p class="message-author">${message.type === messageTypes.LEFT ? message.author : ''}</p>
                <p class="message-date">${message.date}</p>
            </div>
            <p class="message-content">${message.content}</p>
        </div>
    `
}

/**
 * Wrapper function to loop over each message
 * within the application state and create their
 * corresponding HTML elements
 */
const displayMessages = () => {
    const messagesHTML = messages
                            .map(message => createMessageHTML(message))
                            .join('');

    messagesList.innerHTML = messagesHTML;
}

/**
 * Wrapper function for 
 * Socket.io event emitter
 * @param {Object} message -  author, date, content, type
 */
const sendMessage = message => {
    socket.emit('message', message);
};

displayMessages();

/**
 * Basic chatting
 */
sendButton.addEventListener('click', e => {
    //prevent default (form submission)
    e.preventDefault();

    //basic non-empty validation
    if(!messageInput.value) return;

    const date = new Date();
    const day = date.getDate();
    const year = date.getFullYear();
    //add padding with 0 (up to 2 digits) and add +1 to 0-based month index
    const month = ('0' + (date.getMonth() + 1)).slice(-2) 
    const dateString = `${day}.${month}.${year}`;
    const message = {
        author: username,
        date: dateString,
        content: messageInput.value
    }

    sendMessage(message);    

    //making sure the message entry field is reset
    messageInput.value = '';
})

/**
 * Logging in
 */
loginButton.addEventListener('click', e => {
    //prevent default (form submission)
    e.preventDefault();

    //basic non-empty validation
    if(!usernameInput.value) return;

    //get username
    username = usernameInput.value;

    //insert login message to state
    sendMessage({
        author: username,
        type: messageTypes.LOGIN
    })     

    //swap section view from login -> chat
    loginWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');
});