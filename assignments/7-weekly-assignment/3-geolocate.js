// Other require definitions
var request = require("request"); // npm install request
var async = require("async"); // npm install async
var fs = require("fs");

var apiKey = process.env.TAMU_KEY;
// load address table of unique addresses
let addresses = fs.readFileSync("data/parsed/parsed-addressTable.json");
addresses = JSON.parse(addresses);

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(
  addresses,
  function(value, callback) {
    // First part of the request string
    var apiRequest =
      "https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?";

    // Small adjustment according to my json object structure
    apiRequest +=
      "streetAddress=" +
      value.street
        .replace("58-66", "58")
        .replace("206-208", "206")
        .replace("’", "")
        .split(" ")
        .join("%20");

    apiRequest +=
      "&city=New%20York&state=NY&zip=" + value.zipcode + "&apikey=" + apiKey;
    apiRequest += "&format=json&version=4.01";

    request(apiRequest, function(err, resp, body) {
      if (err) {
        throw err;
      } else {
        var tamuGeo = JSON.parse(body);
        // Log if the request was successful
        console.log(tamuGeo["FeatureMatchingResultType"]);
        value["tamuAddress"] = tamuGeo.InputAddress["StreetAddress"].trim();
        value["lat"] = tamuGeo.OutputGeocodes[0].OutputGeocode["Latitude"];
        value["long"] = tamuGeo.OutputGeocodes[0].OutputGeocode["Longitude"];
        console.log(value.long, value.lat, value.tamuAddress);
      }
    });
    setTimeout(callback, 250);
  },
  function() {
    fs.writeFileSync(
      "data/parsed/parsed-geolocated-addressTable.json",
      JSON.stringify(addresses, null, 2)
    );
    console.log("*** *** *** *** ***");
    console.log("Finished");
  }
);
