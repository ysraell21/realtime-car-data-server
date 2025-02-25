import express from "express";
import cors from "cors";
import {
  createTrip, getAllTrips,
  getSpecificTrip,
  updateTrip,
  removeSpecificTrip,
  createMultipleTrips
} from "../controllers/tripControllers";
const router = express.Router();

//middleware
router.use(
  cors({
    credentials: true,
    origin: "http://localhost:5173",
  })
);

router.post("/trips/create-trip", createTrip);
router.post("/trips/create-multiple-trips", createMultipleTrips); // for testing in postman
router.get("/trips", getAllTrips)
router.get("/trips/:id", getSpecificTrip)
router.put("/trips/:id", updateTrip)
router.delete("/trips/:id", removeSpecificTrip)


export default router