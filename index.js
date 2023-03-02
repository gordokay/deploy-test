const express = require('express');
const app = express();
const cors = require('cors');

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

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
})