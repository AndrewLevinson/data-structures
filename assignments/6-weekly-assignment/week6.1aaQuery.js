// AA meetings

const { Client } = require("pg");
const cTable = require("console.table");

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

// Sample SQL statement to query meetings on Monday that start on or after 5:00pm:
// var thisQuery =
//   "SELECT mtgday, mtgtime, mtglocation, mtgaddress, mtgtypes FROM aadata WHERE mtgday = 'Monday' and mtghour >= 7;";
var thisQuery =
  "SELECT datePK, day, starttime, endtime, meetingtype, locationfk, zone FROM times WHERE day = 'Mondays' and meetingType = 'OD'";

client.query(thisQuery, (err, res) => {
  if (err) {
    throw err;
  } else {
    console.table(res.rows);
    client.end();
  }
});
