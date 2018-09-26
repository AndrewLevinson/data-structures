## Weekly Assignment 3

### Process

The process for weekly assignment 3

1. Revise week 2 script to get properly formatted address in clean array
2. Get and set API key as secret global variable
3. Push selected API response data into array of objects

---

### Step 1

- Update script in week two assignment to remove and trim addresses.
- Additionally addresses with hyphenated house number (i.e., 55-63 135th street) don't work in API so they need to be trimmed as well

```javascript
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
```

Also, I had to `JSON.stringify(meetings)` in order to cleanly save all addresses to an array that can be looped over for future use.

### Step 2

- Signed up for Texas A&M global services and got an apiKey to use to make requests.
- I saved that to my global variables and accessed in my code by node like `const apiKey = process.env.TAMU_KEY;` but stays hidden in my Github repo.

### Step 3

- The API response includes a lot of unnecessary information. So I only pushed what was necessary to my array of objects: street address, lat, and long.

```javascript
meetingsData.push({
  streetAddress: tamuGeo["InputAddress"]["StreetAddress"],
  latLong: {
    latitude: tamuGeo.OutputGeocodes[0]["OutputGeocode"]["Latitude"],
    longitude: tamuGeo.OutputGeocodes[0]["OutputGeocode"]["Longitude"]
  }
});
```

Every meeting lives inside an object and the lat and long live inside a nested object within that meeting object.

---
