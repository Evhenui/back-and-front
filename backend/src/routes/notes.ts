import { Router } from 'express';
import {
  getAllNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
} from '../controllers/notes.js';
import { validateBody } from '../middlwere/validate.js';
import { createNoteSchema, updateNoteSchema } from '../schemas/note.js';
import { authenticate } from '../middlwere/authenticate.js';

const router = Router();

router.use(authenticate);

router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.post('/', validateBody(createNoteSchema), createNote);
router.patch('/:id', validateBody(updateNoteSchema), updateNote);
router.delete('/:id', deleteNote);

export default router;