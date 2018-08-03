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

// To start listening to socket connection, (socket) is the object representing incoming socket
//connection from clients
io.on('connection',(socket) =>
{
    console.log("Socket connection made with " + socket.id)
    socket.emit('connected')
    socket.on('send_message',(data) =>
    {
        io.emit('recv_message',data)
    })
})

server.listen(4000,() =>
{
    console.log("Server running at http://localhost:4000");
})

