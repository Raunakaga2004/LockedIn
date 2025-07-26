import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';

//routes
import userRoutes from './routes/user.routes'
import taskRoutes from './routes/task.routes'
import tagRoutes from './routes/tag.routes'

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: 'http://localhost:5173', // allow only frontend origin
  credentials: true, // allow cookies
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
}));
app.use(express.json());
app.use(cookieParser());

app.listen(PORT, ()=>{
  console.log(`Server is running at http://localhost:${PORT}`)
})

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/task', taskRoutes);
app.use('/api/v1/tag', tagRoutes);