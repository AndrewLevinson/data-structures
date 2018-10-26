const { Client } = require("pg");

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = "andrewL";
db_credentials.host = "mydatabase.cyqehoumbbwa.us-east-1.rds.amazonaws.com";
db_credentials.database = "mydatabase";
db_credentials.password = process.env.AWSRDS_PW;

db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table:
// var thisQuery =
//   "CREATE TABLE times (datePK int, day varchar(100), startTime varchar(50), endTime varchar(50), meetingType varchar(50), specialInterest varchar(200), locationFK int, addressFK int, groupFK int, meetingFK int, zone int) ;";

var thisQuery = "ALTER TABLE times ADD PRIMARY KEY (datePK);";

client.query(thisQuery, (err, res) => {
  console.log(err, res);
  client.end();
});
