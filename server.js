const express = require('express');
const path = require('path');
const app = express();
const http = require('http').Server(app);
const io = require('socket.io')(http);


//add middleware: serve static public dir
app.use(express.static(path.join(__dirname, 'public')));

//default get request to base route 'http://localhost:3000/'
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public/index.html'));
});

io.on('connection', socket => {
    console.log('Crazy')
});

//tell server to listen on port 3000
http.listen(3000, ()=>{
    console.log('listening on port 3000')
});