const uniqid = require('uniqid');

let notes = [
  {
    "id": uniqid(),
    "author": "shrimp",
    "message": "hi"
  },
  {
    "id": uniqid(),
    "author": "ted",
    "message": "yea"
  },
  {
    "id": uniqid(),
    "author": "moose",
    "message": "what"
  }
]

module.exports = notes;