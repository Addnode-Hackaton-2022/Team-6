var button1 = document.getElementById('upButton');
button1.onclick = doUpButtonClick;
var button2 = document.getElementById('downButton');
button2.onclick = doDownButtonClick;
getAlarmLevel();
getTankLevel();
//59.3294	18.0686
var map = L.map('map').setView([59.3294, 18.9000], 11);
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap'
}).addTo(map);

function createVehicleMarker(data) {
    var color = data.alarm ? 'red' : 'green'
    var vehicle = L.circle([data.pos.lat, data.pos.lon], {
        color: color,
        fillColor: '#f03',
        fillOpacity: 0.5,
        radius: 100
    }).addTo(map).on('click', onVehicleClick);
    vehicle.fuelLevel = data.fuelLevel;
    vehicle.alarm = data.alarm;
}
vehicles = [
    { id:1, pos: { lat: 59.3294, lon: 18.9520 }, fuelLevel: 100, alarm: false },
    { id:2, pos: { lat: 59.3494, lon: 18.8420 }, fuelLevel: 70, alarm: true },
    { id:3, pos: { lat: 59.2884, lon: 18.8820 }, fuelLevel: 85, alarm: false }
]
vehicles.forEach(vehicle => { createVehicleMarker(vehicle) })

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
