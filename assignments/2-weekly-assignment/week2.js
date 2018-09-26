// npm install cheerio

const fs = require("fs");
const cheerio = require("cheerio");

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
const content = fs.readFileSync("data/08.txt");

// load `content` into a cheerio object
const $ = cheerio.load(content);

// establish container variable for text
const meetings = [];

// scrape txt file for html address elements
$("tbody")
  .last() // last table on page contains addresses
  .children() // find table rows
  // for every td in tr
  .each((i, elem) => {
    meetings[i] = $(elem)
      .children()
      .first()
      .html()
      .split("<br>")[2]
      .trim()
      .split(",")[0]
      .split("-")
      .pop()
      .replace(/-/g, "");
  });

// write to file
fs.writeFileSync("data/08address.JSON", JSON.stringify(meetings));
