var diaryEntries = [];

class DiaryEntry {
  constructor(primaryKey, date, entry, tag, rating, media) {
    this.pk = {};
    this.pk.S = primaryKey.toString();
    this.date = {};
    this.date.S = new Date(date).toDateString();
    this.entry = {};
    this.entry.S = entry;
    this.tag = {};
    this.tag.S = tag;
    this.rating = {};
    this.rating.N = rating.toString();
    if (media != null) {
      this.media = {};
      this.media.SS = media;
    }
    this.month = {};
    this.month.N = new Date(date).getMonth().toString();
  }
}

diaryEntries.push(
  new DiaryEntry(
    0,
    "October 8, 2018",
    "TODAY I LEARNED how to setup a NoSQL database. It went well.",
    "coding",
    4,
    ["week5.1_NoSQLdiagram.png"]
  )
);
diaryEntries.push(
  new DiaryEntry(
    1,
    "October 9, 2018",
    "TODAY I LEARNED that I should start setting alarms at night to go to bed",
    "personal truth",
    7
  )
);
diaryEntries.push(
  new DiaryEntry(
    2,
    "October 11, 2018",
    "TODAY I LEARNED how the `this` keyword works in JavaScript...I think...",
    "coding",
    5
  )
);

// console.log(diaryEntries);

var AWS = require("aws-sdk");
AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

var params = {};

// function to add diary entry
function addEntry(i) {
  params.TableName = "deardiary";
  params.Item = diaryEntries[i];
  dynamodb.putItem(params, function(err, data) {
    if (err) console.log(err, err.stack);
    // an error occurred
    else console.log(data); // successful response
  });
}

// async await function with loop to add all entries in the diary array
async function addAll() {
  for (let i = 0; i < diaryEntries.length; i++) {
    await addEntry(i);
  }
}
addAll();
