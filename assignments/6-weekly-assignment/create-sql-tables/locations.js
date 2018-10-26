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
  "CREATE TABLE locations (locationPK int, name varchar(100), details varchar(300), wheelchairAccess BOOLEAN, addressFK int);";

// var thisQuery = "ALTER TABLE locations ADD PRIMARY KEY (locationPK);";

client.query(thisQuery, (err, res) => {
  console.log(err, res);
  client.end();
});
