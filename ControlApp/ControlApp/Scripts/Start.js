var button1 = document.getElementById('upButton');
button1.onclick = doUpButtonClick;
var button2 = document.getElementById('downButton');
button2.onclick = doDownButtonClick;
getAlarmLevel();
getTankLevel();
setInterval(updateMap, 1000);
var map = L.map('map').setView([59.3294, 18.9000], 11);
getVehicles();
vehicles = [
    { id: 1, pos: { lat: 59.3294, lon: 18.9520 }, fuelLevel: 100, alarm: false, mapObject: null },
    { id: 2, pos: { lat: 59.3494, lon: 18.8420 }, fuelLevel: 70, alarm: true, mapObject: null },
    { id: 3, pos: { lat: 59.2884, lon: 18.8820 }, fuelLevel: 85, alarm: false, mapObject: null }
]
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);
vehicles.forEach(vehicle => createVehicleMarker(vehicle));

function updateMap() {
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
}
function getVehicles() {
    $.ajax({
        url: "http://172.16.67.67:3001/vehicles",
        type: "GET",
        success: function (result) {
            alert(result);
        }
    });

}
function onVehicleClick(e) {
    //alert(this.fuelLevel);
  //  setSelectedVehicle(this.id);
    var label = document.getElementById('tankLevelLabel')
    label.innerHTML = this.fuelLevel;
    var className = this.alarm ? 'alarmRed' : 'alarmGreen';
    var alarm = document.getElementById('alarm');
    alarm.className = className;
}
function getTankLevel() {
    $.ajax({
        url: "https://localhost:44319/api/MainApi/GetTankLevel",
        type: "GET",
        success: function (result) {
            var label = document.getElementById('tankLevelLabel');
            label.innerHTML = result;
        }
    });
}
function getAlarmLevel() {
    $.ajax({
        url: "https://localhost:44319/api/MainApi/GetAlarmLevel",
        type: "GET",
        success: function (result) {
            var label = document.getElementById('alarmLevelLabel')
            label.innerHTML = result;
        }
    });
}
function doUpButtonClick() {
    $.ajax({
        url: "https://localhost:44319/api/MainApi/LevelUp",
        type: "POST",
        success: function (result) {
            var label = document.getElementById('alarmLevelLabel')
            label.innerHTML = result;
        }
    });
}
function doDownButtonClick() {
    $.ajax({
        url: "https://localhost:44319/api/MainApi/LevelDown",
        type: "POST",
        success: function (result) {
            var label = document.getElementById('alarmLevelLabel')
            label.innerHTML = result;
        }
    });
}
