const socket = io();

socket.on('connected',() =>
{
    console.log("Connection made with " + socket.id)
})

// Another way of making the connection was 
/*

const socket = io.connect('http://localhost:4000')
the URL notifies the location of the server to which we want to make the websocket connection to

*/

$(function ()
{
    let messageList = $('#message-list')
    let messageBox = $('#message-box')
    let sendButton = $('#send-btn')

    sendButton.click(function()
    {
        socket.emit('send_message',{message:messageBox.val()})
    })

    socket.on('recv_message',function(data)
    {
        messageList.append($('<h6>' + (data.message) + '</h6>'))
    })
})