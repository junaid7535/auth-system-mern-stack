import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import databaseConnection from './config/db.js';
import authRouter from './Routes/authRoute.js';
import userRouter from './Routes/userRoute.js'

const app = express()
databaseConnection()

app.use(express.json())
app.use(cookieParser())


const allowedOrigins = [
  "http://localhost:5173",                  // local frontend
  "https://authentication-system-full-stack-1.onrender.com",     // deployed frontend
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true
}));


app.use('/api',authRouter);
app.use('/api',userRouter);

const PORT = process.env.PORT || 4000
app.listen(PORT,() => {
    console.log(`server is running at PORT ${PORT}`)
})
