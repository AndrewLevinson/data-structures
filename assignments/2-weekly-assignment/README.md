## Weekly Assignment 2

### Process

The process for weekly assignment 2

1. Inspect html for AA Meeting page 8 to determine structure (or lack of)
2. Learn enough Cheerio syntax to traverse the document
3. Write a code block to find the table cell with the address for each meeting
4. Clean up strings
5. Save address into new text file '08addresses.txt'

---

### Thoughts

- While I was able to locate and and grab the entire table cell (td) for each address successfully, I struggled with pulling out just the address cleanly. It appears the address itself isn't inside of any html tag at all (just free text) so it's hard to grab onto.
- Because of this, the text in the file is was messy. A lot of blank spaces, line breaks, and other pieces of text that also aren't in elements so they couldn't be excluded with cheerio. I was able to fix this with the .split() method and clean it up a bit, but i'm wondering if there was a more elegant way to do this

---

### Next Steps

- If I were to push this further I would try to create a json structure for saving out the addresses with metadata (instead of the just addresses with no context) like something below:

```javascript
"meeting": [
    {
    'name':'meeting name 1',
    'address': '123 main street',
    'details':'Topic saturday, etc.'
    },
    ...
]
```

---
