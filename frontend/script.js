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
    let loginBox = $('#login-box')
    let loginButton = $('#login-btn')
    let chatDiv = $('#chat-div')
    let loginDiv = $('#login-div')
    let heading = $('#heading')
    let feedback = $('#feedback')
    let userName = ''

    loginButton.click(function()
    {
        userName = loginBox.val();
        loginDiv.hide();
        chatDiv.show();
        socket.emit('login',
        {
            user:userName
        })
    })

    sendButton.click(function()
    {
        socket.emit('send_message',
        {
            user:userName,
            message:messageBox.val()
        })
    })

    messageBox.keypress(function()
    {
        socket.emit('typing',
        {
            user:userName
        })
    })

    socket.on('header',function(data)
    {
        heading.append($('<h1 class = "display-4">' + "Write Something, " + data.user + '</h1>'))
    })

    socket.on('type',function(data)
    {
        // html() sets or returns the content of selected element 
        feedback.html($('<h6 class = "font-italic">' + data.user + " is typing..." + '</h6>'))
    })

    socket.on('recv_message',function(data)
    {
        feedback.html($('<h6>' + " " +'</h6>'))
        messageList.append($('<h5>' + (data.user) + ' : ' + (data.message) + '</h5>'))
    })
})