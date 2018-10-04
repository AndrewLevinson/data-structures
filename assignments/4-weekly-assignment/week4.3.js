const { Client } = require("pg");
var async = require("async");
var fs = require("fs");

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = "andrewL";
db_credentials.host = "mydatabase.cyqehoumbbwa.us-east-1.rds.amazonaws.com";
db_credentials.database = "mydatabase";
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// load addresses from parsed file from week 3
const rawData = fs.readFileSync("../3-weekly-assignment/data/zoneEight.JSON");
const addressesForDb = JSON.parse(rawData);

// add addresses with lat and long as rows in mydatabase
async.eachSeries(addressesForDb, function(value, callback) {
  const client = new Client(db_credentials);
  client.connect();
  var thisQuery =
    "INSERT INTO aalocations VALUES (E'" +
    value.streetAddress +
    "', " +
    value.latLong.latitude +
    ", " +
    value.latLong.longitude +
    ");";
  client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
  });
  setTimeout(callback, 1000);
});
