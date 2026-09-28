import express from "express";
import notesRouter from './routes/notes';
import cors from 'cors';
import { errorHandler } from './middlwere/errorHandler.js';4
import authRouter from './routes/auth.js';

const app = express();
const PORT = 3000;

app.use(cors()); 
app.use(express.json());

app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date() });
});

app.use('/api/auth', authRouter);
app.use('/api/notes', notesRouter);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});