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
var thisQuery =
  "CREATE TABLE meetings (meetingPK int, groupFK int, dateFK int, locationFK int);";
// Sample SQL statement to delete a table:
// var thisQuery = "DROP TABLE aalocations;";
// Sample SQL statement to query the entire contents of a table:
// var thisQuery = "SELECT * FROM aalocations;";

client.query(thisQuery, (err, res) => {
  console.log(err, res);
  client.end();
});
