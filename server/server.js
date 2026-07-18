const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();


const { OpenAI } = require('openai');
const openai = new OpenAI({
  baseURL: 'https://api.deepseek.com', 
  apiKey: process.env.DEEPSEEK_API_KEY
});

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch((err) => console.error('Failed to connect to MongoDB', err));

const noteSchema = new mongoose.Schema({
  title: { type: String, required: true },
  subject: { type: String },
  content: { type: String, required: true },

  summary: { type: String }, 

  createdAt: { type: Date, default: Date.now }
});

const Note = mongoose.model('Note', noteSchema);


app.get('/api/notes', async (req, res) => {
  try {
    const notes = await Note.find().sort({ createdAt: -1 });
    res.json(notes);
  } catch (error) {
    res.status(500).json({ error: 'Server error fetching notes' });
  }
});

app.post('/api/notes', async (req, res) => {
  const { title, subject, content } = req.body;
  if (!title || !title.trim() || !content || !content.trim()) {
    return res.status(400).json({ error: 'Title and content cannot be empty' });
  }
  try {
    const newNote = new Note({ title, subject, content });
    const savedNote = await newNote.save();
    res.status(201).json(savedNote);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create note' });
  }
});

app.delete('/api/notes/:id', async (req, res) => {
  try {
    const deletedNote = await Note.findByIdAndDelete(req.params.id);
    if (!deletedNote) {
      return res.status(404).json({ error: 'Note not found' });
    }
    res.json({ message: 'Note deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete note' });
  }
});


app.post('/api/notes/:id/summarize', async (req, res) => {
  try {
    const note = await Note.findById(req.params.id);
    if (!note) return res.status(404).json({ error: 'Note not found' });

    const prompt = `You are an AI writing assistant.

Task: Summarize the following note content in exactly one simple, clear sentence.

Requirements:
- Use plain language.
- Do not add extra details.
- Do not exceed one sentence. \n\nNote Content:\n${note.content}`;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "user", content: prompt }],
      model: "deepseek-v4-flash",
    });

    const summaryText = completion.choices[0].message.content;

  
    note.summary = summaryText;
    const updatedNote = await note.save();

    res.json(updatedNote);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to summarize note' });
  }
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});