import { Note } from '../../models/note.js';

export async function createNote(req, res) {
  const note = await Note.create({
    ...req.body,
    userId: req.user._id,
  });
  res.status(201).json(note);
}
