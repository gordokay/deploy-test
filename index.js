const express = require('express');
const app = express();
const cors = require('cors');
const uniqid = require('uniqid');

let notes = require('./notes');

app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('hi');
})

app.get('/notes', (req, res) => {
  res.json(notes);
})

app.get('/notes/:id', (req, res) => {
  const id = req.params.id;
  const note = notes.find(n => n.id === id);
  if(!note) {
    return res.status(404).json({"error": "note not found"});
  }
  return res.json(note);
})

app.post('/notes', (req, res) => {
  const body = req.body;
  if(!body.author || !body.message) {
    return res.status(400).json({"error": "note must include author and message"});
  }
  const newNote = {
    id: uniqid(),
    author: body.author,
    message: body.message
  }

  notes = notes.concat(newNote);
  res.status(201).json(newNote);
})

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})