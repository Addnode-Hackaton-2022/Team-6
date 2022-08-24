const express = require("express");
const http = require("http");
const axios = require("axios");
const app = express();
app.use(express.json());

const vehicles = [
  {
    requestUrl: "http://localhost:3000",
    name: "Vehicle1",
    position: "59.395892, 17.958529",
  },
  {
    requestUrl: "http://172.16.67.71",
    name: "Vehicle2",
    position: "59.395892, 17.958529",
  },
];

app.get("/", function (req, res) {
  res.send("Hello Backend");
});

app.get("/vehicles", (req, res) => {
  var vehiclesRequests = vehicles.map((vehicle) =>
    axios.get(vehicle.requestUrl.concat("/vehicledata"))
  );
  Promise.all(vehiclesRequests)
    .then((res2) => {
      console.log("statusCode: ".concat(res2.status));
      console.log(res2.body);
      res.send(res2.map((r) => r.body));
    })
    .catch((error) => {
      console.error(error);
    });
});

app.post("/addvehicle", (req, res) => {
  vehicles = vehicles.filter((v) => v.requestUrl !== req.body.requestUrl);
  vehicles.push(req.body);
  res.send(req.body);
});

app.listen(3001, () => console.log("Server listening on port 3001."));
