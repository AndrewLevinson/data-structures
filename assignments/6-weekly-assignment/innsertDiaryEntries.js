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

// previously inserted entries
// diaryEntries.push(
//   new DiaryEntry(
//     "coding",
//     "October 8, 2018 12:00:00",
//     "TODAY I LEARNED how to setup a NoSQL database. It went well.",
//     4,
//     ["week5.1_NoSQLdiagram.png"]
//   )
// );

// diaryEntries.push(
//   new DiaryEntry(
//     "personal truth",
//     "October 9, 2018 23:48:00",
//     "TODAY I LEARNED that I should start setting alarms at night to go to bed",
//     7
//   )
// );

// diaryEntries.push(
//   new DiaryEntry(
//     "coding",
//     "October 11, 2018 15:23:00",
//     "TODAY I LEARNED how the `this` keyword works in JavaScript...I think...",
//     5
//   )
// );

// diaryEntries.push(
//   new DiaryEntry(
//     "personal truth",
//     "October 23, 2018 12:04:00",
//     "TODAY I LEARNED that blue light filtering glasses are very much worth it...especially if you stare at a screen 12 hours a day and want to be able to fall asleep ever.",
//     9
//   )
// );

// diaryEntries.push(
//   new DiaryEntry(
//     "new york",
//     "October 25, 2018 11:37:00",
//     "TODAY I LEARNED that the smallest plot of NYC land is called the Hess Triangle in the Village and it is probably the pettiest piece of land in the world.",
//     6,
//     ["https://en.m.wikipedia.org/wiki/Hess_triangle"]
//   )
// );

// new batch of entries
diaryEntries.push(
  new DiaryEntry(
    "new york",
    "November 1, 2018 13:02:00",
    "TODAY I LEARNED that Halloween in New York is siiiiiick",
    10
  )
);

diaryEntries.push(
  new DiaryEntry(
    "personal truth",
    "November 6, 2018 9:39:00",
    "TODAY I LEARNED that no matter what happens today, half the country will be PISSED #midterms",
    8
  )
);

diaryEntries.push(
  new DiaryEntry(
    "coding",
    "November 10, 2018 22:04:00",
    "TODAY I LEARNED that everyone struggles with coding, no matter how advanced you are. Sometimes I have to tell myself that when after 4 hours of trying to figure out why my code won't work, it turns out I was just spelling opacity wrong...   :/",
    5
  )
);

diaryEntries.push(
  new DiaryEntry(
    "personal truth",
    "November 19, 2018 12:04:00",
    "TODAY I LEARNED that there's a really cool NYT internship available with the graphics team this summer I could potentially qualify for. No way would I have been able to seriously apply a year ago. Makes me realize how much progress I've made in the world of data and design.",
    8
  )
);

diaryEntries.push(
  new DiaryEntry(
    "personal truth",
    "November 20, 2018 20:42:00",
    "TODAY I LEARNED that if you take your birthday off of Facebook, you only have to talk to the people closest to you on your special day.",
    10
  )
);

diaryEntries.push(
  new DiaryEntry(
    "new york",
    "November 25, 2018 14:08:00",
    "TODAY I LEARNED that as disgusting and difficult as New York is, only when you're out of town do you start to realize how much you love it.",
    6
  )
);

diaryEntries.push(
  new DiaryEntry(
    "new york",
    "November 30, 2018 19:30:00",
    "TODAY I LEARNED that there are sooo many cool bars and restaurants on the LES that I had no idea about.",
    3
  )
);

diaryEntries.push(
  new DiaryEntry(
    "coding",
    "December 2, 2018 13:20:00",
    "TODAY I LEARNED how much the NYT graphics style was shaped by D3. I've really been studying it a lot lately since I have a presentation on the topic coming up, and I finally feel like I'm starting to get a handle on it.",
    7
  )
);

diaryEntries.push(
  new DiaryEntry(
    "coding",
    "December 8, 2018 12:57:00",
    "TODAY I LEARNED how to build an express app with node complete with a database query. I UNDERSTAND WEB DEVELOPMENT NOW.",
    10
  )
);

diaryEntries.push(
  new DiaryEntry(
    "personal truth",
    "December 14, 2018 22:14:00",
    "TODAY I LEARNED how to destress by doing breathing exercises before any high stress activity. And never go to bed without winding down first. That's how you have anxiety attacks.",
    10
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
