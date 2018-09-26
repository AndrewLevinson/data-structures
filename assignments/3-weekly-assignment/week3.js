var request = require("request"); // npm install request
var async = require("async"); // npm install async
var fs = require("fs");

// assign global variable to hold private apiKey every session
const apiKey = process.env.TAMU_KEY;
console.log(apiKey);

var meetingsData = [];

// load addresses from parsed file from week 2
const rawData = fs.readFileSync("../2-weekly-assignment/data/08address.JSON");
const addresses = JSON.parse(rawData);
console.log(addresses);

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(
  addresses,
  function(value, callback) {
    var apiRequest =
      "https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?";
    apiRequest += "streetAddress=" + value.split(" ").join("%20");
    apiRequest += "&city=New%20York&state=NY&apikey=" + apiKey;
    apiRequest += "&format=json&version=4.01";

    request(apiRequest, function(err, resp, body) {
      if (err) {
        throw err;
      } else {
        var tamuGeo = JSON.parse(body);
        console.log(tamuGeo["FeatureMatchingResultType"]);

        // push needed data from API response into an array of objects
        meetingsData.push({
          streetAddress: tamuGeo["InputAddress"]["StreetAddress"],
          latLong: {
            latitude: tamuGeo.OutputGeocodes[0]["OutputGeocode"]["Latitude"],
            longitude: tamuGeo.OutputGeocodes[0]["OutputGeocode"]["Longitude"]
          }
        });
      }
    });
    setTimeout(callback, 2000);
  },
  function() {
    fs.writeFileSync("data/zoneEight.json", JSON.stringify(meetingsData));
    console.log("*** *** *** *** ***");
    console.log("Number of meetings in this zone: ");
    console.log(meetingsData.length);
  }
);
