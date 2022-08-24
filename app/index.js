const express = require('express');
const WebSocket = require("ws");
const res = require('express/lib/response');
const app = express();
app.use(express.json());
var fuelLevel;

var calcFuelLevel = function(data) {
    console.log("data3: " + data[3]);
    console.log("data4: " + data[4]);
    return (data[3] | data[4] << 8) / 50
}

var isSignalValue = function(data) {
    return data[1] === 5 && data[2] === 3;
}

var connect = function() {
    const ws = new WebSocket('ws://172.16.55.42/ws')
    ws.on('open', function(){
        console.log("Socket open");

        setTimeout(() => {
            ws.send(JSON.stringify({data:[3,0,1],messagecmd:1,messagetype:17,size:3}));
            ws.send(JSON.stringify({data:[3,0,0],messagecmd:1,messagetype:17,size:3}));
            console.log("sent");
        }, 1000)
    });

    ws.on('error', function(){
        console.log("error");
    });

    ws.on('close', function(){
        console.log('socket close, reconnecting');
        setTimeout(connect, 10);
    });
    
    ws.on('message', function(msg){
        var data = JSON.parse(msg).data;
        
        if(isSignalValue(data)) {
            fuelLevel = calcFuelLevel(data);
        } 
    });


}
connect();

app.get('/', function (req, res) {
  res.send('Hello World')
});

app.get('/tanklevel', function(req, res) {
    res.send(JSON.stringify({"fuelLevel": fuelLevel}));
});

app.post('/tanklevel', function(req, res){
    console.log(req.body);
});

app.listen(3000)