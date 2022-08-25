const express = require("express");
const axios = require("axios");
const app = express();
app.use(express.json());
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "*");
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
      const allVehicles = res2.map((r) => r.data);
      console.log("Vehicles:", allVehicles);
      res.send(allVehicles);
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/addvehicle", (req, res) => {
  vehicles = vehicles.filter((v) => v.id !== req.body.id);
  vehicles.push(req.body);
  console.log("/addvehicle", req.body);
  res.send(req.body);
});

app.post("/alarmthreshold", function (req, res) {
  console.log("/alarmthreshold", req.body, typeof req.body);
  const vehicleData = req.body;
  const vehicle = vehicles.find((vehicle) => vehicle.id === vehicleData.id);
  if (vehicle) {
    axios
      .put(`http://${vehicle.requestUrl}/alarmthreshold`, {
        threshold: vehicleData.threshold,
      })
      .then((res2) => {
        res.send(vehicleData);
      })
      .catch((error) => {
        console.error(error);
        res.next();
      });
  }
});

app.post("/resetalarm", function (req, res) {
  console.log("/resetalarm vehicleId:", req.body, typeof req.body);
  const vehicleData = req.body;
  const vehicle = vehicles.find((vehicle) => vehicleData.id === vehicle.id);
  if (vehicle) {
    axios
      .put(`http://${vehicle.requestUrl}/resetalarm`)
      .then((res2) => {
        vehicle.resetAlarm = false;
        res.send(false);
      })
      .catch((error) => {
        console.error(error);
      });
  }
});

app.listen(3001, () => console.log("Server listening on port 3001."));
