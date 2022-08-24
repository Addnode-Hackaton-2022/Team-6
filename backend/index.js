const express = require("express");
const http = require("http");
const axios = require("axios");
const app = express();
app.use(express.json());

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

app.listen(3001, () => console.log("Server listening on port 3001."));
