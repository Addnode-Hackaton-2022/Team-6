const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

let vehicles = [];

app.get("/", function (req, res) {
  res.send("Hello Backend");
});

app.get("/vehicles", (req, res) => {
  var vehiclesRequests = vehicles.map((vehicle) =>
    axios.get(`http://${vehicle.requestUrl}/vehicledata`)
  );

  Promise.all(vehiclesRequests)
    .then((res2) => {
      console.log(res2.map((r) => r.data));
      res.send(res2.map((r) => r.data));
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/addvehicle", (req, res) => {
  vehicles = vehicles.filter((v) => v.id !== req.body.id);
  vehicles.push(req.body);
  console.log(req.body);
  res.send(req.body);
});

app.post("/alarmthreshold", function (req, res) {
  const vehicle = JSON.parse(req.body);
  axios.post(`http://${vehicle.requestUrl}/alarmthreshold`).then((res2) => {
    res.send(vehicle.threshold);
  });
});

app.post("/resetalarm", function (req, res) {
  const vehicle = JSON.parse(req.body);
  axios.post(`http://${vehicle.requestUrl}/resetalarm`).then((res2) => {
    res.send(vehicle.resetAlarm);
  });
});

app.post("/alarmthreshold", function (req, res) {
  const newVehicleData = JSON.parse(req.body);
  const vehicle = vehicles.find((vehicle) => vehicle.id === id);
  if (vehicle) {
    axios.post(`http://${vehicle.requestUrl}/alarmthreshold`).then((res2) => {
      res.send(newVehicleData.threshold);
    });
  }
});

app.listen(3001, () => console.log("Server listening on port 3001."));
