const express = require('express');
const WebSocket = require("ws");
const res = require('express/lib/response');
const app = express()
app.use(express.json());




var connect = function() {
    const ws = new WebSocket('ws://172.16.55.42/ws')
    ws.on('open', function(){
        console.log("Socket open");
    });

    ws.on('error', function(){
        console.log("error");
    });

    ws.on('close', function(){
        console.log('socket close, reconnecting');
        setTimeout(connect, 1000);
    });

    ws.on('message', function(msg){
        console.log(JSON.parse(msg));
    });
}
connect();

app.get('/', function (req, res) {
  res.send('Hello World')
});

app.get('/tanklevel', function() {
    //Fråga lådan om tanklevel
    //Return tanklevel
});

app.post('/tanklevel', function(req, res){
    console.log(req.body);
});

app.listen(3000)