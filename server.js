const path = require('path')
const express = require('express')
const socket = require('socket.io')
const formatMessage = require('./utils/messages')
const {userJoin , getCurrentUser ,userLeave , getRoomUsers} = require('./utils/users')

const app = express()

//static files
app.use(express.static('public'))
const botname="ChatCord bot"

const server = app.listen(process.env.PORT || 3000 || 4000, ()=>{
    console.log("listening to requests");
})

const io = socket(server)

io.on('connection' , socket=>{
    console.log('connection established');

    socket.on('joinRoom',({username, room})=>{
    const user  = userJoin(socket.id , username , room)
        socket.join(user.room)
        
    socket.emit('message',formatMessage(botname , "Welcome to ChatCord!"))
 
    //Broadcast
    socket.broadcast.to(user.room).emit('message' , formatMessage(botname , user.username+" has joined the chat"))

    //send users and room info
    io.to(user.room).emit('roomUsers',{
        room: user.room,
        users: getRoomUsers(user.room)
    })

    })

    //on disconnect
    socket.on('disconnect',()=>{
        //this notifies everyone
        const user =userLeave(socket.id)

        if(user)
        io.to(user.room).emit('message',formatMessage(botname , user.username+" has left the chat"))

        io.to(user.room).emit('roomUsers',{
            room: user.room,
            users: getRoomUsers(user.room)
        })
    })
    
    //listen for chatMessage
    socket.on('chatMessage',(msg)=>{
        const user = getCurrentUser(socket.id)
        console.log(msg);
        io.to(user.room).emit('message',formatMessage(user.username , msg))
    })

})