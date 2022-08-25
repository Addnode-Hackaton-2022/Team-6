const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const WebSocket = require("ws");
var ws;

const express = require('express');
const app = express();
const res = require('express/lib/response');
app.use(express.json());
app.use((req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept"
    );
    next();
  });

const fs = require('fs');

const requestUrl = '172.16.67.71:3000';
const vehicleId = 1;

var fuelLevel;
var threshold;
var alarm;

// Behövs eftersom vi inte alltid får rätt data för threshold
var requestedWduInfo = false;

function log(msg) {
    console.log(msg);
    var d = new Date(),
        content = d.toLocaleTimeString() + ' ' + msg;

    if (fs.existsSync('logs/log_' + d.toLocaleDateString('sv') + '.txt')) {
        fs.appendFile('logs/log_' + d.toLocaleDateString('sv') + '.txt', "\n"+ content, err => {
            if (err) {
                console.error("Error appending log: " + err);
                return;
            }
        });
    } else {
        fs.writeFile('logs/log_' + d.toLocaleDateString('sv') + '.txt', content, err => {
            if (err) {
                console.error("Error writing log file: " + err);
                return;
            }
        });
    }

}

function calcFuelLevel(data) {
    var level = (data[3] | data[4] << 8) / 50;
    if (level > 100) {
        level = 100;
    }
    
    return level;
}

function calcThreshold(data) {
    return (data[4] | data[5] << 8) / 1000;
}

function isSignalValue(data) {
    return data[1] === 5 && data[2] === 3;
}

function requestWduInfo() {
    requestedWduInfo = true;
    ws.send(JSON.stringify({"messagetype":96,"messagecmd":0,"size":14,"data":[6,0,1,0,2,0,3,0,4,0,5,0,6,0]}));	
    ws.send(JSON.stringify({"messagetype":96,"messagecmd":1,"size":2,"data":[0,0]}));

    setTimeout(() => {
        ws.send(JSON.stringify({messagetype: 49, messagecmd: 1, size: 3, data: [0, 0, 0]}));
        ws.send(JSON.stringify({messagetype: 49, messagecmd: 1, size: 3, data: [0, 0, 0]}));
    }, 100);

}

var connect = function() {
    ws = new WebSocket('ws://172.16.55.42/ws');
    ws.on('open', function() {
        log('socket open');
        fetch("http://172.16.67.67:3001/addvehicle",
        {
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify({ id:vehicleId, pos: { lat: 59.3294, lon: 18.9520 }, fuelLevel: fuelLevel, alarm: alarm, threshold: threshold, requestUrl: requestUrl })
        })
        .then(function(res){ log("Registred the vehicle"); requestWduInfo(); })
        .catch(function(res){ log("Failed to registry"); });
    });

    ws.on('error', function() {
        log('error');
    });

    ws.on('close', function() {
        log('socket close, reconnecting...');
        setTimeout(connect, 100);
    });
    
    ws.on('message', function(msg){
        var json = JSON.parse(msg),
        data = json.data;

        // Heartbeat
        if (json.messagetype == 48 && json.size == 0) {
            ws.send(JSON.stringify({messagetype: 128, messagecmd: 0, size: 1, data: [0]}));
        }

        // Fuel level
        else if (data[0] == 1 && isSignalValue(data)) {
            fuelLevel = calcFuelLevel(data);
        }
        // requestWduInfo
        else if (requestedWduInfo && data[0] == 5 && json.messagecmd == 5) {
            requestedWduInfo = false;
            threshold = calcThreshold(data);
        }
        // Alarm
        else if (data[0] == 6) {
            alarm = data[2] == 1;
        }
    });
}
connect();

app.get('/', function (req, res) {
    res.send('Hello World');
});

app.get('/fuellevel', function(req, res) {
    res.send(JSON.stringify({'fuelLevel': fuelLevel}));
});

app.get('/alarm', function(req, res) {
    res.send(JSON.stringify({'alarm': alarm}));
});

app.get('/alarmthreshold', function(req, res) {
    res.send(JSON.stringify({'threshold': threshold}));
});

app.get('/vehicledata', function(req, res) {
    res.send(JSON.stringify({ id:vehicleId, pos: { lat: 59.3294, lon: 18.9520 }, fuelLevel: fuelLevel, alarm: alarm, threshold: threshold, requestUrl: requestUrl }));
});

app.put('/alarmthreshold', function(req, res) {
    var json = JSON.parse(req.body);
    
    if (json.threshold && json.threshold >= 0 && json.threshold <= 100) {
        threshold = json.threshold;
        ws.send(JSON.stringify({messagetype: 17, messagecmd: 3, size: 5, data: [4, 0, 0, threshold, 0]}));
    }
});

app.put('/resetalarm', function(req, res) {
    alarm = false;
    ws.send(JSON.stringify({messagetype: 17, messagecmd: 1, size: 3, data: [6, 0, 1]}));
});


app.listen(3000);
