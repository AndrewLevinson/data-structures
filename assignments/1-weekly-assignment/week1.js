// npm install request
// mkdir data

var request = require("request");
var fs = require("fs");

// array for unique part of url
let pageNumber = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];

// loop through each page to request and write each txt file
for (i = 0; i < pageNumber.length; i++) {
  try {
    // throw then catch each http request to manage control flow by ensuring every request is completed in loop
    throw i;
  } catch (i) {
    request(`https://parsons.nyc/aa/m${pageNumber[i]}.html`, function(
      error,
      response,
      body
    ) {
      if (!error && response.statusCode == 200) {
        fs.writeFileSync(`data/${pageNumber[i]}.txt`, body);
        console.log(pageNumber[i]);
      } else {
        console.log("Request failed!");
      }
    });
  }
}
