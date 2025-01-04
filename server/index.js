import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import { userRoute } from './routes/userRoute.js';
import { residencyRoute } from './routes/residencyRoute.js';
dotenv.config()

const app = express();

const PORT = process.env.PORT || 3000;

const corsOptions = {
    origin: 'http://localhost:3000', 
    methods: ['GET', 'POST', 'PUT', 'DELETE'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  };
app.use(express.json())
app.use(cookieParser())
app.use(cors());

app.listen(8000 , ()=>{
    console.log(`Server is running on ${PORT}`);
})

app.use('/api/user' , userRoute)
app.use("/api/residency" , residencyRoute);