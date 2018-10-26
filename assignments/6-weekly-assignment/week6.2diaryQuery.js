// dear diary

// npm install aws-sdk
var AWS = require("aws-sdk");
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {
  TableName: "deardiaryrevised",
  KeyConditionExpression:
    "#tp = :topicName and #dt between :minDate and :maxDate", // the query expression
  ExpressionAttributeNames: {
    // name substitution, used for reserved words in DynamoDB
    "#tp": "tag",
    "#dt": "date"
  },
  ExpressionAttributeValues: {
    // the query values
    // need to always use primary key in every query
    ":topicName": { S: "personal truth" },
    ":minDate": { S: new Date("October 10, 2018").valueOf().toString() },
    ":maxDate": { S: new Date("October 26, 2018").valueOf().toString() }
  }
};

dynamodb.query(params, function(err, data) {
  if (err) {
    console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
  } else {
    console.log("Query succeeded.");
    data.Items.forEach(function(item) {
      console.log("***** ***** ***** ***** ***** \n", item);
    });
  }
});
