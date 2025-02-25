import express from 'express'
import dontenv from 'dotenv'
import cors from 'cors'
import WebSocket from "ws";
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
const WS_URL = process.env.WS_URL || "ws://localhost:8765"

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


// websocket connection
const ws = new WebSocket(WS_URL);

ws.on("open", () => {
  console.log("Connected to WebSocket Server");
});

ws.on("message", (data) => {
  try {
    const locationData = JSON.parse(data.toString());
    return locationData
  } catch (error) {
    console.error("Error parsing WebSocket data:", error);
  }
});

ws.on("close", () => {
  console.log("WebSocket connection closed");
});

ws.on("error", (error) => {
  console.error("WebSocket error:", error);
});