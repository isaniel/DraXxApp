const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const formatMessage = require('./public/scripts/messages')
const {getCurrentUser, userJoin, userLeaves} = require('./public/scripts/users')

const PORT = process.env.PORT || 5000;


const botName = 'DraXxap Admin'
const app = express();
const server = http.createServer(app);
const io = socketIo(server); // Initialize Socket.IO

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/login.html');
});

// Listen for incoming Socket.IO connections
io.on('connection', (socket) => {
    console.log(`user connected`);
socket.on('joinRoom', ({username, room}) =>{
    const user = userJoin(socket.id, username, room)

    socket.join(user.room)




    socket.emit('message', formatMessage(botName, 'welcome to DraXxap'))

    socket.broadcast.to(user.room).emit('message',formatMessage(botName,`${user.username} has joined the chat`))


    // io.to(user.room).emit('roomUsers', {
    //     room:user.room,
    //     users: getRoomUsers(user.room)
    //     })


    

    // listen for chat message
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id)
        console.log(`${user.username}: ${msg}`)

        io.to(user.room).emit('message',formatMessage( user.username, msg))
    })

    socket.on('disconnect', ()=>{
        const user = userLeaves(socket.id)
        if (user){
            
        
        io.to(user.room).emit('message', formatMessage(botName,`${user.username } has left the chat`))
        // io.to(user.room).emit('roomUsers', {
        //     room:user.room,
        //     users: getRoomUsers(user.room)
        //     })
    
        }
    })


} )

   
});

// Start the server
server.listen(PORT, function(error) {
    if (error) {
        console.log(`Something went wrong`, error);
    } else {
        console.log(`Server is listening on port ${PORT}`);
    }
});
