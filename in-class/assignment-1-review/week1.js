// npm install request
// mkdir data

var request = require("request");
var fs = require("fs");

// loop through each page to request and write each txt file
for (var i = 1; i < 11; i++) {
  if (i < 10) {
    i = "0" + i;
  }
  function requestMeeting(idx) {
    var url = "https://parsons.nyc/aa/m" + idx + ".html";
    var fn = "data/m" + idx + ".txt";
    request(url, function(error, response, body) {
      if (!error && response.statusCode == 200) {
        fs.writeFileSync(fn, body);
        console.log("success" + i + idx);
      } else {
        console.log("Request failed!");
      }
    });
  }
  requestMeeting(i);
}
