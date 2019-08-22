const express = require("express"), // npm install express
  app = express();
const fs = require("fs");
const csv = require("csv-parser");
const moment = require("moment-timezone"); // moment-timezone --save

var s1x = `<!DOCTYPE html>
<head>
  <meta charset="utf-8">
  <title>The Motion of Music</title>
  <link rel="shortcut icon" type="image/png" href="assets/ss.png" />
  <link rel="stylesheet" href="css/typography.css">
  <link rel="stylesheet" href="css/SSstyles.css">
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,400,600,700" rel="stylesheet">
  <script src="howler.min.js"></script>
</head>
<body>
<div class="container">
  <div class="text-content">
    <h1>Mapping Motion to Music</h1>
    <p>By using an <a href="https://www.adafruit.com/product/163" target="_blank">accelerometer</a> sensor, I'm mapping the <span class="x">X</span> and <span class="y">Y</span> positions of my guitar while playing <span class="song-title">Killing in the Name Of <img src="assets/sound-off.svg" id="sound-on"/></span> by Rage Against the Machine.</p>
    <p><span class="hover-text">Hover</span> over the points to see and hear that part of the song.</p>
  </div>
  <div id="chart"></div>
</div>
<script src="https://d3js.org/d3.v5.min.js"></script>
<script>

var data = `;

var s2x = `; 

// find smallest minute
let minMin = d3.min(data, d => { return d.sensorminute });
let indexMin = data.indexOf(d3.min(data, d => { return d.sensorminute })) + 1;
// find second of smallest minute
let minSec = data[indexMin].sensorsecond;

// starting moment
let uniqueMin = minMin * 60 + minSec;

// create unique value based on time to visualize data linearly
data.forEach( el => { 
  el.uniqueMoment = parseFloat((el.sensorminute * 60 + el.sensorsecond) - uniqueMin); 
});

// data = data.filter(d => {
//   return d.uniqueMoment < (100 + d3.min(data, d => { return d.uniqueMoment }));
// });


var margin = { top: 50, right: 50, bottom: 50, left: 40 },
width = window.innerWidth * 0.925 - margin.left - margin.right,
height = window.innerHeight * 0.70 - margin.top - margin.bottom;

let minVal = d3.min(data, d => { return d.uniqueMoment });
let maxVal = d3.max(data, d => { return d.uniqueMoment });

// console.log(d3.max(data, d => { return d.xvalue }));
// console.log(d3.max(data, d => { return d.yvalue }));

console.log(data);


var xScale = d3
  .scaleLinear()
  .domain([minVal, maxVal])
  .range([0, width]);

var yScale = d3
  .scaleLinear()
  .domain([
    d3.min(data, function(d) {
      return d.yvalue;
    }),
    d3.max(data, function(d) {
      return d.xvalue;
    })
  ])
  .range([height, 0]);

var svg = d3
  .select("#chart")
  .append("svg")
  .attr("width", width + margin.left + margin.right)
  .attr("height", height + margin.top + margin.bottom)
  .append("g")
  .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

// call the x axis in a group tag
svg
  .append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale));

// call the y axis in a group tag
svg
  .append("g")
  .attr("class", "y-axis")
  .call(d3.axisLeft(yScale));

// x axis title
let xAxisTitle = svg
  .append("g")
  .attr("id", "xAxisTitle")
  .append("text")
  .text("Seconds Into Song")
  .attr("x", width - 2)
  .attr("y", height - 8)
  .style("text-anchor", "end");

// y axis title
let yAxisTitle = svg
  .append("g")
  .attr("id", "yAxisTitle")
  .append("text")
  .text("Accelerometer Value")
  .attr("x", 5)
  .attr("y", 5)
  .style("text-anchor", "start");

// tooltip method
var tooltip = {
  element: null,
  init: function() {
    this.element = d3
      .select("body")
      .append("div")
      .attr("class", "tooltip")
      .style("opacity", 0);
  },
  show: function(t) {
    this.element
      .html(t)
      .transition()
      .duration(200)
      .style("left", d3.event.pageX + 20 + "px")
      .style("top", d3.event.pageY - 20 + "px")
      .style("opacity", 0.95);
  },
  move: function() {
    this.element
      .transition()
      .duration(30)
      .style("left", d3.event.pageX + 20 + "px")
      .style("top", d3.event.pageY - 20 + "px")
      .style("opacity", 0.95);
  },
  hide: function() {
    this.element
      .transition()
      .duration(500)
      .style("opacity", 0);
  }
};
tooltip.init();

// define the x line
var xLine = d3
  .line()
  .x(function(d) {
    return xScale(d.uniqueMoment);
  })
  .y(function(d) {
    return yScale(d.xvalue);
  });

// define the y line
var yLine = d3
  .line()
  .x(function(d) {
    // return xScale(Date.parse(d.exacttime));
    return xScale(d.uniqueMoment);
  })
  .y(function(d) {
    return yScale(d.yvalue);
  });

// x line
let pathX = svg
  .append("path")
  .datum(data)
  .attr("d", xLine)
  .attr("class", "xLine");

// yline
let pathY = svg
  .append("path")
  .datum(data)
  .attr("d", yLine)
  .attr("class", "yLine");

var totalLengthX = pathX.node().getTotalLength();
var totalLengthY = pathY.node().getTotalLength();

let delayDuration = 3000;

pathX
  .attr("stroke-dasharray", totalLengthX + " " + totalLengthX)
  .attr("stroke-dashoffset", totalLengthX)
  .transition()
  .duration(delayDuration)
  .ease(d3.easeLinear)
  .attr("stroke-dashoffset", 0);

pathY
  .attr("stroke-dasharray", totalLengthY + " " + totalLengthY)
  .attr("stroke-dashoffset", totalLengthY)
  .transition()
  .duration(delayDuration)
  .ease(d3.easeLinear)
  .attr("stroke-dashoffset", 0);

// add x circles
let circleX = svg
  .selectAll(".dot-xAccel")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "dot-xAccel")
  .attr("cx", function(d, i) {
    return xScale(d.uniqueMoment);
  })
  .attr("cy", function(d) {
    return yScale(d.xvalue);
  })
  .attr("r", 3.5)
  .attr("opacity", 0);

// x circles appear transition
circleX
  .transition()
  .ease(d3.easeLinear)
  .delay(delayDuration + 300)
  .attr("opacity", 1);

// add y circles
let circleY = svg
  .selectAll(".dot-yAccel")
  .data(data)
  .enter()
  .append("circle")
  .attr("class", "dot-yAccel")
  .attr("cx", function(d, i) {
    // return xScale(Date.parse(d.exacttime));
    return xScale(d.uniqueMoment);
  })
  .attr("cy", function(d) {
    return yScale(d.yvalue);
  })
  .attr("r", 3.5)
  .attr("opacity", 0);

circleY
  .transition()
  .ease(d3.easeLinear)
  .delay(delayDuration + 300)
  .attr("opacity", 1);

// add song to site
var sound = new Howl({
  src: ['assets/song.m4a'],
  mute: true
});
Howler.volume(0.95);
sound.play();
sound.on('end', () => { return sound.play(); });

function playSong(d) {
  sound
    .seek(d.uniqueMoment - minVal)
    .mute(false)
    .fade(0.0, 1.0, 1000)
    .once('fade', () => { return sound.fade(1.0, 0.0, 5000); });
}

// song preview in title
const songTitle = document.querySelector(".song-title");
const soundIcon = document.getElementById("sound-on");
songTitle.addEventListener("mouseover", () => { sound.mute(false).seek(38).fade(0.0, 1.0, 1000); soundIcon.src="assets/sound-on.svg"  } );
songTitle.addEventListener("mouseout", () => { sound.mute(true); soundIcon.src="assets/sound-off.svg" });




var formatSeconds = d3.timeFormat("%M:%S");

// add tooltip on hover for Y
circleY
  .on("mouseover", function(d) {
    playSong(d);

    tooltip.show(
      \`<b>\${formatSeconds(Date.parse(d.exacttime) - ((uniqueMin + minVal) * 1000))}
      </b><img src="assets/sound-on-black.svg" id="sound-on-black"/><br>
      Guitar Position: [ <span class="x-small">\${d.xvalue}</span> , <span class="y-small">\${d.yvalue}</span> ]<br>
       \`
    );
  })
  .on("mousemove", function(d, i) {
    tooltip.move();
    // circleY.attr("fill-opacity", 0.5);
    d3.select(this).attr("fill-opacity", 0.5);
  })
  .on("mouseout", function(d, i) {
    tooltip.hide();
    d3.select(this).attr("fill-opacity", 1);
    sound.mute(true);
  });

// add tooltip on hover for X
circleX
  .on("mouseover", function(d) {
    playSong(d);

    tooltip.show(
      \`<b>\${formatSeconds(Date.parse(d.exacttime) - ((uniqueMin + minVal) * 1000))}
      </b><img src="assets/sound-on-black.svg" id="sound-on-black"/><br>
      Guitar Position: [ <span class="x-small">\${d.xvalue}</span> , <span class="y-small">\${d.yvalue}</span> ]<br>
       \`
    );
  })
  .on("mousemove", function(d, i) {
    tooltip.move();
    d3.select(this).attr("fill-opacity", 0.5);
  })
  .on("mouseout", function(d, i) {
    tooltip.hide();
    d3.select(this).attr("fill-opacity", 1);

    sound.mute(true);
  });

</script>`;

// sensor code to get local file (not using AWS since it shut down to save cost. copied data as JSON)
app.get("/ss", function(req, res) {
  fs.readFile("data-static/sensor.json", "utf8", function(err, data) {
    if (err) throw err;
    var sensorData = JSON.parse(data);
    var resp = s1x + JSON.stringify(sensorData) + s2x;
    res.send(resp);
    console.log("1) responded to request for sensor data");
  });
});

// create templates
var oneDD = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Today I Learned</title>
  <link rel="shortcut icon" type="image/png" href="assets/dd.png" />

  <meta name="description" content="Andrew's Dear Diary Entries">
  <meta name="author" content="DD">
  <link rel="stylesheet" href="css/DDstyles.css">
  <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,600" rel="stylesheet">
</head>
<body>
<div class="container">
    <h2 class="title">Today I <span class="learned">Learned</span></h2>
    <div class="main">
        <div class="sidebar">
            <p>By: <strong>Andrew Levinson</strong></p>
            <hr align="right">
            <ul>
                <form action="/action_page.php">
                    <li> <label for="1">Personal Truth</label> <input type="radio" id="1" name="topic" value="personal truth" onClick=updateQuery(value)></li>
                    <li><label for="2">Coding</label> <input type="radio" id="2" name="topic" value="coding" onClick=updateQuery(value)></li>
                    <li><label for="3">New York</label> <input type="radio" id="3" name="topic" value="new york" onClick=updateQuery(value)></li>
                    <li><label for="4">All Topics</label> <input type="radio" id="4" name="topic" value="" checked="checked" onClick=updateQuery(value)></li>
                </form>
            </ul>
        </div>
        <div class="posts">
        </div>
    </div>
</div>
  <script>

  var data = 
  `;

var twoDD = `;

// sort entries by date on front end
function compare(a,b) {
    if (a.date.S > b.date.S)
    return -1;
    if (a.date.S < b.date.S)
    return 1;
    return 0;
}
data = data.sort(compare);
console.log(data);

    var currentValue = 0;
    var filteredData;

    const posts = document.querySelector(".posts");

    function displayPosts() {
        reset();
        for(var x = 0; x < filteredData.length; x++){
        let article = posts.appendChild(document.createElement("article"));
        let title = article.appendChild(document.createElement("h3"));
        title.innerHTML = \`<span class="topic">\${filteredData[x].tag}</span>\`;

        let postDate = article.appendChild(document.createElement("h5"));
        postDate.className="date";
        postDate.innerHTML = \`\${new Date(new Date(JSON.parse(filteredData[x].date)))}\`;

        let content = article.appendChild(document.createElement("p"));
        content.className="content";
        content.innerHTML = \`\${filteredData[x].entry}\`    
        
        let rating = article.appendChild(document.createElement("h5"));
        rating.className="rating";
        rating.innerHTML = \`Rating: \${filteredData[x].rating} out of 10\` 
        }
    } 

    function reset() {
        posts.innerHTML = "";
    }

    function updateQuery(e) {
        currentValue = e;
        if (!currentValue){
            filteredData = data;
        } else {
        filteredData = data.filter(d => d.tag == currentValue); 
        }
        displayPosts()
    } updateQuery();

    const activeRadio= document.getElementsByName("topic");
    const colorObject = {
        0: "#f77cf6",
        1: "#f7cc7c",
        2: "#f77c7c",
        3: "#7c92f7",
    }

    for (var i = 0; i < activeRadio.length; i++) {
        index(i);
        function index(i) {
            activeRadio[i].addEventListener('click', x => selectTopic(i));
        }
    }

    function selectTopic(e) {
        document.styleSheets[0].rules[0].style.setProperty('--active', colorObject[e]);
        activeRadio.forEach(resetCheck => {
        resetCheck.previousElementSibling.classList.remove('active');
        });
        activeRadio[e].previousElementSibling.classList.add('active');
    } selectTopic(3);

    </script>
    </body>
    </html>`;

// code to get local csv file (not using AWS DynamoDB since it shut down to save cost. copied data as csv)
const results = [];
app.get("/deardiary", function(req, res) {
  fs.createReadStream("data-static/deardiaryrevised.csv")
    .pipe(csv())
    .on("data", data => results.push(data))
    .on("end", () => {
      var resp = oneDD + JSON.stringify(results) + twoDD;
      res.send(resp);
    });
});

// create templates
var hx = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>AA Meetings</title>
  <link rel="shortcut icon" type="image/png" href="assets/aa.png" />
  <meta name="description" content="Meetings of AA in Manhattan">
  <meta name="author" content="AA">
  <link rel="stylesheet" href="css/AAstyles.css?v=1.0">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
   integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>
   <link href="https://fonts.googleapis.com/css?family=IBM+Plex+Mono:400,600" rel="stylesheet">
</head>

<body>
<div class="panel">
    <div class="content">
        <h2>AA Meetings in New York</h2>
        <p id="empty-state">← Select a location on the map to view details ←</p>
        <div id="content" class="hidden">
          <div class="section">
              <p id="meeting-info"></p>
          </div>
          <div class="section">
          <h4 class="sub-header">Schedule</h4>
          <p id="schedule"></p>
          </div>
          <div class="section">
          <h4 class="sub-header">Additional Details</h4>
          <p id="details"></p>
          </div>
        </div>
    </div>
</div>
<div id="mapid"></div>
  <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
   integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
   crossorigin=""></script>
  <script>
  var data = 
  `;

var jx = `;
    console.log(data);
    
    var mymap = L.map('mapid').locate({setView: true, maxZoom: 16});

    function onLocationError(e) {
       mymap.setView([40.734636,-73.994997], 13);
    }
    
    mymap.on('locationerror', onLocationError);

    var activeLocation = 0;
    L.tileLayer(
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.{ext}?access_token={accessToken}",
        {
          // attribution:
          //   'Map data &copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors, <a href="http://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="http://mapbox.com">Mapbox</a>',
          minZoom: 1,
          // maxZoom: 10,
          noWrap: true,
          opacity: 0.9,
          id: "mapbox.streets",
          ext: "png",
          accessToken:
            "pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w"
        }
      ).addTo(mymap);

    for (var i=0; i<data.length; i++) {
        L.marker( [data[i].lat, data[i].long], { 
            dataIndex: i
        })
            .bindPopup(JSON.parse(JSON.stringify(data[i].location == '' ? data[i].address : data[i].location)))
            .addTo(mymap)
            .on('click', onClick);
    }

    const meetingInfo = document.getElementById("meeting-info");
    const schedule = document.getElementById("schedule");
    const details = document.getElementById("details");
    const content = document.getElementById("content");
    const emptyState = document.getElementById("empty-state");

    function onClick(e) {
        activeLocation = e.target.options.dataIndex;
        activePanel();
    }

    function resetPanel() {
        schedule.innerHTML = "";
        meetingInfo.innerHTML = "";
        content.classList.remove("hidden");
        emptyState.classList.add("hidden");
    }

    function activePanel() {
        resetPanel();

        meetingInfo.innerHTML = \`<b>\${
        data[activeLocation].location
        }</b> at <br>\${data[activeLocation].address}<br>New York, NY \${data[activeLocation].zip}<br><br> \${data[activeLocation].details}
        \`;

        details.innerHTML= \`Group Name: \${data[activeLocation].groupname}<br> Special Interests: \${  data[activeLocation].specialinterest != "null" ? data[activeLocation].specialinterest : "none"}<br> Wheelchair Access: \${ data[activeLocation].wheelchair ? 
        "Yes": "No"}<br>\`;
        
        for(var x=0; x<data[activeLocation].meetings.length; x++){
        schedule.appendChild(document.createTextNode(\`\${data[activeLocation].meetings[x].day}: \${
            data[activeLocation].meetings[x].starttime
        } – \${
            data[activeLocation].meetings[x].endtime
        }\`))

        schedule.appendChild(document.createElement("br"));
        }
        let scheduleDetails = schedule.appendChild(document.createElement("p"));
        scheduleDetails.innerHTML = \`\${data[activeLocation].scheduledetails}\`
    }
     
    </script>
    </body>
    </html>`;

// AA code to get local file (not using AWS since it shut down to save cost. copied data as JSON)
app.get("/aa", function(req, res) {
  var now = moment.tz(Date.now(), "America/New_York");
  var dayy = now.day().toString();
  var hourr = now.hour().toString();

  let dayMatch = {
    1: "mondays",
    2: "tuesdays",
    3: "wednesdays",
    4: "thursdays",
    5: "fridays",
    6: "saturdays",
    7: "sundays"
  };
  console.log(dayMatch[dayy]);

  fs.readFile("data-static/aa.json", "utf8", function(err, data) {
    if (err) throw err;
    var aaData = JSON.parse(data);
    var resp = hx + JSON.stringify(aaData) + jx;
    res.send(resp);
    console.log("2) responded to request for aa meeting data");
  });

  //   client.query(thisQuery, (qerr, qres) => {
  //     if (qerr) {
  //       throw qerr;
  //     } else {
  //       var resp = hx + JSON.stringify(qres.rows) + jx;
  //       res.send(resp);
  //       client.end();
  //       console.log("2) responded to request for aa meeting data");
  //     }
  //   });
});

// serve static files in /public
app.use(express.static("public"));

// listen on port 8080
app.listen(8080, function() {
  console.log("Server listening on 8080...");
});
