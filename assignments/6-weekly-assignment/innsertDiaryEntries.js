var diaryEntries = [];

class DiaryEntry {
  constructor(tag, date, entry, rating, media) {
    this.tag = {};
    this.tag.S = tag;
    this.date = {};
    this.date.S = new Date(date).valueOf().toString();
    this.entry = {};
    this.entry.S = entry;
    this.rating = {};
    this.rating.N = rating.toString();
    if (media != null) {
      this.media = {};
      this.media.SS = media;
    }
  }
}

diaryEntries.push(
  new DiaryEntry(
    "coding",
    "October 8, 2018 12:00:00",
    "TODAY I LEARNED how to setup a NoSQL database. It went well.",
    4,
    ["week5.1_NoSQLdiagram.png"]
  )
);

diaryEntries.push(
  new DiaryEntry(
    "personal truth",
    "October 9, 2018 23:48:00",
    "TODAY I LEARNED that I should start setting alarms at night to go to bed",
    7
  )
);

diaryEntries.push(
  new DiaryEntry(
    "coding",
    "October 11, 2018 15:23:00",
    "TODAY I LEARNED how the `this` keyword works in JavaScript...I think...",
    5
  )
);

diaryEntries.push(
  new DiaryEntry(
    "personal truth",
    "October 23, 2018 12:04:00",
    "TODAY I LEARNED that blue light filtering glasses are very much worth it...especially if you stare at a screen 12 hours a day and want to be able to fall asleep ever.",
    9
  )
);

diaryEntries.push(
  new DiaryEntry(
    "new york",
    "October 25, 2018 11:37:00",
    "TODAY I LEARNED that the smallest plot of NYC land is called the Hess Triangle in the Village and it is probably the pettiest piece of land in the world.",
    6,
    ["https://en.m.wikipedia.org/wiki/Hess_triangle"]
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
  params.TableName = "deardiaryrevised";
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
