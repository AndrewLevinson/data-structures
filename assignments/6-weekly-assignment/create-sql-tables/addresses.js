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
  "CREATE TABLE addresses (addressPK int PRIMARY KEY, lat double precision, long double precision, street varchar(100), city varchar(100), zipcode varchar(100), zone int, tamuAddress varchar(100));";

// Sample SQL statement to delete a table:
// var thisQuery = "DROP TABLE addresses;";
// Sample SQL statement to query the entire contents of a table:
// var thisQuery = "SELECT * FROM aalocations;";

// var thisQuery = "ALTER TABLE addresses ADD PRIMARY KEY (addressPK);";

client.query(thisQuery, (err, res) => {
  console.log(err, res);
  client.end();
});
