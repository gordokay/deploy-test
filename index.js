require("dotenv").config();

const express = require("express");
const app = express();
const cors = require("cors");
const morgan = require("morgan");

const Note = require("./models/note");

const unknownEndpoint = (req, res) => {
  res.status(404).json({ error: "unknown endpoint" });
};

app.use(express.static("build"));
app.use(express.json());
app.use(cors());
app.use(morgan("tiny"));

app.get("/", (req, res) => {
  res.send("hi");
});

app.get("/notes", (req, res) => {
  Note.find({}).then((notes) => res.json(notes));
});

app.get("/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findById(id)
    .then((note) => {
      if (!note) {
        return res.status(404).json({ error: "note not found" });
      }
      return res.json(note);
    })
    .catch((error) => next(error));
});

app.post("/notes", (req, res, next) => {
  const body = req.body;
  const note = new Note({
    author: body.author,
    message: body.message,
  });

  note
    .save()
    .then((savedNote) => res.status(201).json(savedNote))
    .catch((error) => next(error));
});

app.put("/notes/:id", (req, res, next) => {
  const id = req.params.id;
  const { author, message } = req.body;
  Note.findByIdAndUpdate(
    id,
    { author, message },
    { new: true, runValidators: true, context: "query" }
  )
    .then((updatedNote) => {
      if (!updatedNote) {
        return res.status(404).json({ error: "note not found" });
      }
      res.status(201).json(updatedNote);
    })
    .catch((error) => next(error));
});

app.delete("/notes/:id", (req, res, next) => {
  const id = req.params.id;
  Note.findByIdAndDelete(id)
    .then(() => res.status(204).end())
    .catch((error) => next(error));
});

app.use(unknownEndpoint);

const errorHandler = (error, req, res, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return res.status(400).json({ error: "Malformed id" });
  } else if (error.name === "ValidationError") {
    return res
      .status(400)
      .json({ error: "Note must include author and message" });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
