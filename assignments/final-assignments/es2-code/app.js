var request = require("request");
const { Client } = require("pg");

// PARTICLE PHOTON
var device_id = process.env.PHOTON_ID;
var access_token = process.env.PHOTON_TOKEN;
var particle_variable = "json";
var device_url =
  "https://api.particle.io/v1/devices/" +
  device_id +
  "/" +
  particle_variable +
  "?access_token=" +
  access_token;

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
// db_credentials.user =
// db_credentials.host = process.env.AWSRDS_EP;
// db_credentials.database =
// db_credentials.password =
// db_credentials.port =

var getAndWriteData = function() {
  // Make request to the Particle API to get sensor values
  request(device_url, function(error, response, body) {
    // Store sensor values x, y and z for accelerometer in 3 variables
    var sv = JSON.parse(JSON.parse(body).result);

    var svX = sv["x"];
    var svY = sv["y"];
    var svZ = sv["z"];

    // console.log(svX);

    // var svZ = JSON.parse(body).result[0]["z"];

    // console.log(sv);

    // var svX = 0;
    // var svY = 1;
    // var svZ = 2;

    // // Connect to the AWS RDS Postgres database
    const client = new Client(db_credentials);
    client.connect();

    // Construct a SQL statement to insert sensor values into a table
    var thisQuery =
      "INSERT INTO sensorData VALUES (" +
      svX +
      ", " +
      svY +
      ", " +
      svZ +
      ", DEFAULT);";
    // var thisQuery = "DELETE FROM sensordata;";

    console.log(thisQuery); // for debugging

    // Connect to the AWS RDS Postgres database and insert a new row of sensor values
    client.query(thisQuery, (err, res) => {
      console.log(err, res);
      client.end();
    });
  });
};
getAndWriteData();

// write a new row of sensor data every five minutes
// setInterval(getAndWriteData, 300000);

// write a new row of sensor data every 1 second when running. Will not always keep running. Only running when pulling values about 5 min a day.
setInterval(getAndWriteData, 1000);
