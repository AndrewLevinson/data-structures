## Weekly Assignment 1

### Process

The starter code provided uses the node Request and FS modules to make an HTTP request with a url and then subsequently write those files.

In order to successfully manipulate this code to save 10 new pages – through some trial and error – I determined I had 3 tasks to accomplish.

1. Create an array with the unique portion of each url that needs to be requested
2. Loop through the request and save txt files for all pages
3. Handle the program control flow (e.g., a `for` loop will complete way before the page requests are completed). An asynchronous headache.

---

#### 1. Array

```javascript
let pageNumber = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10"];
```

This one was pretty easy since each page's unique url portion was just the page number. The reason I used strings instead of just looping 10 times is that pages 1 - 9 are actually "01" through "09". There may be a more elegant way to handle this; however, it's clear and readable in the code so it will do just fine.

#### 2. `For` Loop

Since I need to run the request and file write for every element in the array, wrapping the request/write starter code in a `For` loop seemed like the most obvious choice.

```javascript
for (i = 0; i < pageNumber.length; i++) {
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
```

The only change to the original code here is to replace the hardcoded url with the `${pageNunber[i]}` so it runs for each unique url in the array.

#### 3. Handle Control Flow

While this code might look like it's enough, it doesn't work! If you run the above code, it will likely only make one request even though it loops all 10 times. Why? because JavaScript is asynchronous. Basically, JS won't wait for the request to complete before running the rest of the code. By the time the first request is completed, the `for` loop has loooong been over.

While there are many ways in JS to solve this (callbacks, promises, async/await), I took an approach that only requires a few characters.

```javascript
try {
  throw i; // generates an exception
} catch (i) {
  // statements to handle any exceptions
  // run all my code in here
}
```

Try, throw, catch is intended to be used to handle custom errors when running code. First, it tries something and will `throw` an error if it doesn't work. That error is passed into a catch block which executes some code. Additionally, like in the code above, if the only thing in the `try` block is a `throw` statement, it guarantees an "error."

Let's look at the finished `for` loop code to see why this works:

```javascript
for (i = 0; i < pageNumber.length; i++) {
  try {
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
```

Basically, I'm forcing the code to `throw` an error and passing `i` to the `catch` block. Since each iteration of the loop is forced to error, the `catch` will run for every iteration of the loop regardless of the speed of the code inside the `catch` block. It doesn't stop JS from running asynchronously – however, it ensures each request is made.

_Also, I'm not sure of this but I believe it's as performant as possible because it will still asynchronously make all 10 requests as fast as the for loop runs without having to wait for each request to return. We can check this by logging out the pageNumber[i] for each request. It shows that the pages are not sequential_

I'm not sure if this `try throw catch` solution is considered "hacky" or clever...but for now it works and I believe it's semantic AND performant.

---
