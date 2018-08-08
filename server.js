const express = require('express');
const socket = require('socket.io');
const path = require('path');
const http = require('http');


const app = express();

const server = http.createServer(app);
app.use('/',express.static(path.join(__dirname,'frontend')))

// ALT const server = app.listen();(using the express server)
// const io = socket(server) 
const io = socket(server)

let userSocket = {}

// To start listening to socket connection, (socket) is the object representing incoming socket
//connection from clients
io.on('connection',(socket) =>
{
    console.log("Socket connection made with " + socket.id)
    socket.emit('connected')

    socket.on('login',(data) =>
    {
        // Here we will get the usernames and their socket IDs
        userSocket[data.user] = socket.id
        // Sending the id for "typing message..."
        io.to(userSocket[data.user]).emit('header',data)
    })

    socket.on('typing',(data) =>
    {
        socket.broadcast.emit('type',data)
    })

    socket.on('send_message',(data) =>
    {
        if(data.message.startsWith('@'))
        {
            /* 
            Splitting at spaces and getting the one at 0th index i.e we are left with 
            @nameofreciever, then did substr to remove @ and get the name of 
            reciever itself
            */
            let recipient = data.message.split(' ')[0].substr(1);
            let recipientSocket = userSocket[recipient]
            // recipientSocket has now the socket id of the reciever
            io.to(recipientSocket).emit('recv_message',data)
        }
        else
        {
            // The following line means sending to all including the sender
            //io.emit('recv_message',data)
            // Broadcasting means sending to all excluding the sender
            socket.broadcast.emit('recv_message',data)
        }
    })
})

server.listen(4000,'0.0.0.0',() =>
{
    console.log("Server running at http://localhost:4000");
})
/* '0.0.0.0' signifies that other devices when on the same network can access this application
    by computerip:portnumber
 */

