var button1 = document.getElementById('upButton');
button1.onclick = doUpButtonClick;
var button2 = document.getElementById('downButton');
button2.onclick = doDownButtonClick;
var alarmButton = document.getElementById('alarm');
alarmButton.onclick = resetAlarm;
//getAlarmLevel();
getTankLevel();
setInterval(updateMap, 1000);
var map = L.map('map');
map.setView([59.3294, 18.9000], 11);
//map.on('click', hideInfoDiv);
vehicles = [];
getVehicles();
[{ "id": 1, "pos": { "lat": 59.3294, "lon": 18.952 }, "fuelLevel": 100, "alarm": true, "threshold": 30, "requestUrl": "172.16.67.71:3000" }]
cheatVehicles = [
    { id: 2, pos: { lat: 59.3494, lon: 18.8420 }, fuelLevel: 70, alarm: true, "threshold": 25, "requestUrl": "172.16.67.71:3000" },
    { id: 3, pos: { lat: 59.2884, lon: 18.8820 }, fuelLevel: 85, alarm: false, "threshold": 35, "requestUrl": "172.16.67.71:3000" }
]
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
vehicles.forEach(vehicle => createVehicleMarker(vehicle));

function resetAlarm() {
    $.ajax({
        url: "http://172.16.67.67:3001/resetalarm",
        crossDomain: true,
        contentType: "application/json",
        dataType: "json",
        type: "POST",
        data: JSON.stringify( { "id": 1 }),
        success: function (result) {
        }
    });
}

function hideInfoDiv(e) {
    var infoDiv = document.getElementById('infoDiv');
    infoDiv.style.visibility = 'hidden';

}
function updateMap() {
    getVehicles();
    if (vehicles.length === 0) return;
    vehicles[0].pos.lon += 0.0005;
    vehicles.forEach(vehicle => {
        var color = vehicle.alarm ? 'red' : 'green';
        var newLatLng = new L.LatLng(vehicle.pos.lat, vehicle.pos.lon);
        vehicle.mapObject.setLatLng(newLatLng);
        vehicle.mapObject.setStyle({ fillColor: color, color: color });
    });

}

function createVehicleMarker(data) {
    var color = data.alarm ? 'red' : 'green';
    data.mapObject = L.circle([data.pos.lat, data.pos.lon], {
        color: color,
        fillColor: color,
        fillOpacity: 0.5,
        radius: 100
    });
    data.mapObject.addTo(map).on('click', onVehicleClick);
    data.mapObject.fuelLevel = data.fuelLevel;
    data.mapObject.alarm = data.alarm;
    data.mapObject.id = data.id;
    data.mapObject.threshold = data.threshold;
    return data;
}
function updateVehicleInfo(marker) {
    //alert(this.fuelLevel);
    //  setSelectedVehicle(this.id);
    var label = document.getElementById('tankLevelLabel')
    label.innerHTML = marker.fuelLevel;
    var className = marker.alarm ? 'alarmRed' : 'alarmGreen';
    var alarm = document.getElementById('alarm');
    alarm.className = className;
    var infoDiv = document.getElementById('infoDiv');
    infoDiv.dataset.boatid = marker.id;
    infoDiv.style.visibility = 'visible';
    var label = document.getElementById('alarmLevelLabel')
    label.innerHTML = marker.threshold;
}
function getVehicles() {
    $.ajax({
        url: "http://172.16.67.67:3001/vehicles",
        crossDomain: true,
        //dataType: 'jsonp',
        type: "GET",
        success: function (result) {
            result.concat(cheatVehicles);
            vehicles = result.map(r => {
                var v = vehicles.find(v => v.id === r.id);
                if (v) {
                    var data = { ...v, ...r };
                    data.mapObject.fuelLevel = r.fuelLevel;
                    data.mapObject.alarm = r.alarm;
                    data.mapObject.threshold = r.threshold;
                    return data;
                }
                else
                    return createVehicleMarker(r);
            });
        }
    }
    );
    var infoDiv = document.getElementById('infoDiv');
    var selectedBoat = infoDiv.dataset.boatid;
    var vehicle = vehicles.find(v => v.id == selectedBoat);
    if (vehicle) {
        updateVehicleInfo(vehicle.mapObject);
    }
}
function onVehicleClick(e) {
    updateVehicleInfo(this);
}
function getTankLevel() {
    $.ajax({
        url: "http://localhost:60670/api/MainApi/GetTankLevel",
        type: "GET",
        success: function (result) {
            var label = document.getElementById('tankLevelLabel');
            label.innerHTML = result;
        }
    });
}
function getAlarmLevel() {
    $.ajax({
        url: "http://172.16.67.67:3001/alarmthreshold",
        type: "GET",
        success: function (result) {
            var label = document.getElementById('alarmLevelLabel')
            label.innerHTML = result;
        }
    });
}
function doUpButtonClick() {
    var currentLevel = parseInt(document.getElementById('alarmLevelLabel').innerHTML);
    if(currentLevel < 100)
        currentLevel = currentLevel + 10;;
    $.ajax({
        url: "http://172.16.67.67:3001/alarmthreshold",
        crossDomain: true,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "id": 1,
            "threshold": currentLevel
        }),
        success: function (result) {
            var label = document.getElementById('alarmLevelLabel')
            label.innerHTML = currentLevel;
        }
    });
}
function doDownButtonClick() {
    var currentLevel = parseInt(document.getElementById('alarmLevelLabel').innerHTML);
    if (currentLevel > 0)
        currentLevel = currentLevel - 10;
    $.ajax({
        url: "http://172.16.67.67:3001/alarmthreshold",
        crossDomain: true,
        type: "POST",
        contentType: "application/json",
        dataType: "json",
        data: JSON.stringify({
            "id": 1,
            "threshold": currentLevel
        }),
        success: function (result) {
            var label = document.getElementById('alarmLevelLabel')
            label.innerHTML = currentLevel;
        }
    });
}
