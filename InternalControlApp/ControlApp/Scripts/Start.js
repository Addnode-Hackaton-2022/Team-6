var button1 = document.getElementById('upButton');
button1.onclick = doUpButtonClick;
var button2 = document.getElementById('downButton');
button2.onclick = doDownButtonClick;
getAlarmLevel();
getFuelLevel();
var alarmLevel = 0;

function getFuelLevel() {
    console.log("updating fuel");
    $.ajax({
        url: "http://172.16.67.71:3000/fuellevel",
        type: "GET",
        success: function (result) {
            var obj = JSON.parse(result);
            var label = document.getElementById('tankLevelLabel');
            label.innerHTML = obj.fuelLevel;
        }
    });
}

function getAlarmLevel() {
    $.ajax({
        url: "http://172.16.67.71:3000/alarmthreshold",
        type: "GET",
        success: function (result) {
            var obj = JSON.parse(result);
            alarmLevel = obj.threshold;
            updateAlarmLabel();
        }
    });
}

function setAlarmLevel() {
    /*$.ajax({
        url: "http://172.16.67.71:3000/alarmthreshold",
        type: "PUT",
        d
        success: function (result) {
            var label = document.getElementById('alarmLevelLabel')
            label.innerHTML = result;
        }
    });*/


    $.ajax({
        type: 'PUT',
        url: 'http://172.16.67.71:3000/alarmthreshold',
        contentType: 'application/json',
        dataType: 'json',
        data: JSON.stringify({"threshold": alarmLevel}) // access in body
    }).done(function () {
        console.log('SUCCESS');
    }).fail(function (msg) {
        console.log('FAIL');
    }).always(function (msg) {
        console.log('ALWAYS');
    });
}

function updateAlarmLabel() {
    var label = document.getElementById('alarmLevelLabel')
    label.innerHTML = alarmLevel;
}

function doUpButtonClick() {
    alarmLevel += 10;
    updateAlarmLabel();
    setAlarmLevel();
}

function doDownButtonClick() {
    alarmLevel = alarmLevel - 10;
    updateAlarmLabel();
    setAlarmLevel();
}
