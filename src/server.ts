import express from 'express'
import dontenv from 'dotenv'
import cors from 'cors'
import mongoose from 'mongoose'
import indexRoutes from './routes/indexRoutes'


dontenv.config()

const app = express()
app.use(
  cors({
    origin: "http://localhost:5173", 
    credentials: true, 
  })
);
app.use(express.json());


const PORT = process.env.SERVER_PORT || 1747

// mongodb connection
mongoose
  .connect(process.env.MONGO_URL || "")
  .then(() => {
    console.log("MongoDB connected")
    app.listen(PORT, () => {
      console.log(`Server is running on port: ${PORT}`)
    })
  }).catch((err) => console.error("MongoDB connection error:", err));


app.use("/", indexRoutes);
