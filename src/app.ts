import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './utils/db';
import authRoutes from './routes/authRoutes';
import dictionaryRoutes from './routes/dictionaryRoutes';
import userRoutes from './routes/userRoutes';
dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use(function(req, res, next) {
  const startTime = Date.now();
  res.on('finish', function() {
      const duration = Date.now() - startTime;
      console.log(duration)
  });
  next();
});

app.use('/auth', authRoutes);
app.use('/', dictionaryRoutes);
app.use('/', userRoutes);
app.get('/', (req, res) => {
  res.json({ message: 'Fullstack Challenge 🏅 - Dictionary' });
});

const PORT = process.env.PORT;

app.listen(PORT, () => {
  connectDB();
  console.log(`Server running on port ${PORT}`);
});
