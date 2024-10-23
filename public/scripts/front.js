const body = document.querySelector('.body')
const btn = document.querySelector('.btn')
const textBox = document.querySelector('.msg')

textBox.addEventListener('focus', function(){
    textBox.style.border = '5px'
    textBox.style.outline = 'solid'
    textBox.style.outlineColor = 'black'
    btn.style.color = 'white'
    textBox.style.outlineWidth = '1px'
    btn.style.backgroundColor = 'black'
    
})
textBox.addEventListener('blur', function (){
    textBox.style.outlineColor = 'none'
    btn.style.color = 'black'
    btn.style.backgroundColor = 'white'

    
})
btn.addEventListener('submit', function(e) {
    e.preventDefault();
})


const chatform = document.querySelector('.chat-form ')
const chatMessages = document.querySelector('.chat-messages')
const main = document.querySelector('.main')
const messageInput = document.querySelector('.messageInput')
const roomname = document.getElementById('username-display')


const {username, room} = Qs.parse(location.search,{
    ignoreQueryPrefix: true
})


const socket = io()

socket.emit('joinRoom', {username, room})

socket.on('roomUsers', ({room, users}) => {
    outputRoomName(room)
    outputName(users)

})

socket.on('message', message => {
    console.log(message)
    outputMessage(message)

 chatMessages.scrollTop = chatMessages.scrollHeight
})

//dubmission

chatform.addEventListener('submit', (e)=>{
    e.preventDefault()

    const msg = document.querySelector('.msg').value
    socket.emit('chatMessage', msg)
    messageInput.value = ''
    messageInput.focus()
})

function outputMessage(message) {
    const div = document.createElement('div');
    div.classList.add('message');

    // Check if the message is sent by the current user
    if (message.username === username) {
        div.classList.add('sent'); // Add a class for sent messages
        div.innerHTML = `<p class="text">${message.text}</p>
        <small>${message.time}</small>`;
    } else {
        div.classList.add('received'); // Add a class for received messages
        div.innerHTML = `<strong class="username">${message.username}:</strong>
                         <p class="text">${message.text}</p><small>${message.time}</small>`;
    }

    document.querySelector('.chat-messages').appendChild(div);
}


function outputRoomName(room){
    roomname.innerText = room 
}