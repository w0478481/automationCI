//Server Code

//get express server
const express = require('express');

//call express
const app = express();

//get socket.io
const socketIO = require('socket.io');

//get http
const http = require('http');


app.get('/', (req, res) => {
    // res.send('Hello World');
    res.sendFile(`${__dirname}/chat.html`);
});


// //listening on port 3000
// app.listen(3000, function(){
//     console.log('listening on 3000');
// });

let count = 0
//launch server and bindsocket.io
const httpServer = http.createServer(app).listen(3000);
const io = socketIO(httpServer);


//set up first node event handler to connect server
io.on('connection', (socket) => {
    console.log('Client Connected');
    count++;


//radical -make and send our own event
socket.emit('welcome', 'Welcome to the APPD5015 Chat Server');


//handle new chat event from the client
socket.on('message', (newChat) => {
    console.log(newChat);
    //send this message to anyone in the chat room
    io.emit('new_message', newChat);

});
    
    
//set up second node event handler to disconnect------------------
    socket.on('disconnect', () => {
        console.log('Client disconnected');
        count--;

        // io.emit('User_left', 'A user left the Group chat');
        // io.emit('count', count)
    });
});

//Outside client socket connection handler.
setInterval(()=>{
    io.emit('server_time', new Date().toTimeString());
    io.emit('count', count)

}, 1000)
  


