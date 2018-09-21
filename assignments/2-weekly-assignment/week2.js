// npm install cheerio

const fs = require("fs");
const cheerio = require("cheerio");

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
const content = fs.readFileSync("data/08.txt");

// load `content` into a cheerio object
const $ = cheerio.load(content);

// establish container variable for text
const table = [];

$("tbody")
  .last() // last table contains addresses
  .children() // find table rows
  // for every td in tr
  .each((i, elem) => {
    table[i] =
      $(elem)
        .children()
        .first() // find first table cell
        .text()
        .trim() + "\n"; // try to clean it up a little with trim
  });

// write to file
fs.writeFileSync("data/aaAddress.txt", table);
