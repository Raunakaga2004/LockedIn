import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

//routes
import userRoutes from './routes/user.routes'
import taskRoutes from './routes/task.routes'
import tagRoutes from './routes/tag.routes'
import habitRoutes from './routes/habit.routes'
import pomodoroRoutes from './routes/pomodoro.routes'
import workoutRoutes from './routes/workout.route'

// starts the daily recurrence cron job
import './cron/reapeatJob'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// comma-separated list in env, falling back to the local Vite dev server
const allowedOrigins = (process.env.CORS_ORIGIN ?? 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({
  origin: allowedOrigins, // allow only frontend origin(s)
  credentials: true, // allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(cookieParser());

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/task', taskRoutes);
app.use('/api/v1/tag', tagRoutes);
app.use('/api/v1/habit', habitRoutes);
app.use('/api/v1/pomodoro', pomodoroRoutes);
app.use('/api/v1/workout', workoutRoutes);

app.listen(PORT, () => {
  console.log(`Server is running at http://localhost:${PORT}`)
})
