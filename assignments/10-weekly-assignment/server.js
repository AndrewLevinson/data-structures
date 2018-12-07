var express = require("express"), // npm install express
  app = express();
const { Pool } = require("pg");
var AWS = require("aws-sdk");

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = "andrewL";
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = "mydatabase";
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// AWS DynamoDB credentials
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

// respond to requests for /sensor
app.get("/sensor", function(req, res) {
  // Connect to the AWS RDS Postgres database
  const client = new Pool(db_credentials);

  // SQL query
  var q = `SELECT EXTRACT(DAY FROM sensortime) as recordingday, EXTRACT(SECOND FROM sensortime) as sensorsecond, json_agg(json_build_object('exactTime', sensortime, 'x_value', xValue, 'y_value', yValue, 'z_value', zValue)) as values

             FROM sensordata
             GROUP BY recordingday, sensorsecond;`;

  // `json_agg(json_build_object('day', day, 'time', starttime)) as meetings`;
  client.connect();
  client.query(q, (qerr, qres) => {
    if (qerr) {
      throw qerr;
    } else {
      res.send(qres.rows);
      client.end();
      console.log("1) responded to request for sensor data");
    }
  });
});

// respond to requests for /aameetings
app.get("/aameetings", function(req, res) {
  // Connect to the AWS RDS Postgres database
  const client = new Pool(db_credentials);

  // SQL query
  var thisQuery = `SELECT addresses.street as address, addresses.addresspk as addressUnique, locations.name as location, json_agg(json_build_object('day', day, 'time', starttime)) as meetings
                   FROM times
                        JOIN meetings ON times.datepk=meetings.datefk
                        JOIN locations ON meetings.locationfk=locations.locationpk
                        JOIN groups ON meetings.groupfk=groups.grouppk
                        JOIN addresses ON locations.addressfk=addresses.addresspk
                   GROUP BY addressUnique, address, location
                   ORDER BY addressUnique
                   ;`;

  client.query(thisQuery, (qerr, qres) => {
    if (qerr) {
      throw qerr;
    } else {
      res.send(qres.rows);
      client.end();
      console.log("2) responded to request for aa meeting data");
    }
  });
});

// respond to requests for /deardiary
app.get("/deardiary", function(req, res) {
  // Connect to the AWS DynamoDB database
  var dynamodb = new AWS.DynamoDB();

  // DynamoDB (NoSQL) query
  var params = {
    TableName: "deardiaryrevised",
    KeyConditionExpression: "#tp = :topicName", // the query expression
    ExpressionAttributeNames: {
      // name substitution, used for reserved words in DynamoDB
      "#tp": "tag"
    },
    ExpressionAttributeValues: {
      // the query values
      ":topicName": { S: "coding" }
    }
  };

  dynamodb.query(params, function(err, data) {
    if (err) {
      console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
      res.send(data.Items);
      console.log("3) responded to request for dear diary data");
    }
  });
});

// serve static files in /public
app.use(express.static("public"));

// listen on port 8080
app.listen(8080, function() {
  console.log("Server listening...");
});
