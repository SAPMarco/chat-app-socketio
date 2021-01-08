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

displayMessages();

sendButton.addEventListener('click', e => {
    //prevent default (form submission)
    e.preventDefault();

    //basic non-empty validation
    if(!messageInput.value) return;

    const message = {
        author: username,
        date: new Date(),
        content: messageInput.value,
        type: messageTypes.RIGHT
    }

    //add new data to the state
    messages.push(message);

    displayMessages();

    //making sure the message entry field is reset
    messageInput.value = '';

    //being automatically scrolled to the bottom
    chatWindow.scrollTop = chatWindow.scrollHeight;
})

loginButton.addEventListener('click', e => {
    //prevent default (form submission)
    e.preventDefault();

    //basic non-empty validation
    if(!usernameInput.value) return;

    //get username
    username = usernameInput.value;

    //insert login message to state
    messages.push({
        author: username,
        type: messageTypes.LOGIN
    })

    //swap section view from login -> chat
    loginWindow.classList.add('hidden');
    chatWindow.classList.remove('hidden');

    //refresh messages array/view
    displayMessages();
});