import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors'
import morgan from 'morgan';
import { connectDB } from './config/db';
import projectRoutes from './router/projectRoutes'
import authRoutes from './router/authRoutes'
import { corsConfig } from './config/cors';

dotenv.config();

connectDB();

const app = express();
app.use(cors(corsConfig))

//logging
app.use(morgan('dev'));

//read form data
app.use(express.json());

//Routes
app.use('/api/projects', projectRoutes)
app.use('/api/auth', authRoutes)

export default app;