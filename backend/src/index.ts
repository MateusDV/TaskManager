import express from 'express';
import dotenv from 'dotenv';
import cors from "cors";
import tasks from './routes/tasks.route';
import auth from './routes/auth.route';

dotenv.config({ path:"../.env"});

const secret = process.env.JWT_SECRET_KEY;
if (!secret) {
  console.error("Missing JWT_SECRET_KEY variable");
}

const app = express();


app.use(cors({
  origin: process.env.FRONTEND_CORS_URL,
}));

app.use(express.json());

app.use("/auth", auth)
app.use("/tasks", tasks);

app.listen(3000, () => {
  console.log('Task Manager backend is running at http://localhost:3000');
});