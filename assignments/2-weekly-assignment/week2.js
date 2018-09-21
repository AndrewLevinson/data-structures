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

// scrape txt file for html address elements
$("tbody")
  .last() // last table on page contains addresses
  .children() // find table rows
  // for every td in tr
  .each((i, elem) => {
    table[i] = $(elem)
      .children()
      .first()
      .html()
      .split("<br>")[2]
      .split(",")[0]
      .trim();
  });

// write to file
fs.writeFileSync("data/08address.txt", table);
