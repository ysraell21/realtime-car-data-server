import { Request, Response } from 'express';
import Trip, { ITrip } from '../models/Trip';

// create a new trip
const createTrip = async (req: any, res: any) => {
  try {
    const trip = await Trip.create(req.body as ITrip);
    res.status(200).json({ success: true, data: trip });
  } catch (error: any) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Vehicle ID is already taken. Please use a different one.",
        field: "vehicleId",
      });
    }

    if (error.name === "ValidationError") {
      const errors: Record<string, string> = {};
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }
      return res.status(400).json({ success: false, errors });
    }

    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

// create multiple trip { for testing in postman }
const createMultipleTrips = async (req: Request, res: Response) => {
  try {
    const trips = await Trip.insertMany(req.body as ITrip[]);
    res.status(200).json({ success: true, data: trips });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

// get all trips
const getAllTrips = async (_: any, res: Response) => {
  try {
    const trip = await Trip.find({});
    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

// get specific trip
const getSpecificTrip = async (req: any, res: any) => {
  try {
    const { id } = req.params ?? {};
    const trip = await Trip.findById(id);
    if (!trip)
      return res
        .status(404)
        .json({ message: `Cannot find any trip with ID ${id}` });
    res.status(200).json({ success: true, data: trip });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

// update trip
const updateTrip = async (req: any, res: any) => {
  try {
    const { id } = req.params;
    if (!id) return res.status(400).json({ message: "Trip ID is required" });

    const trip = await Trip.findById(id);
    if (!trip) {
      return res.status(404).json({ message: `Cannot find any trip with ID ${id}` });
    }

    Object.assign(trip, req.body);

    await trip.validate();

    const updatedTrip = await trip.save();

    res.status(200).json(updatedTrip);
  } catch (error: any) {
    if (error.code === 11000) {
      // Handle duplicate key error
      return res.status(400).json({
        success: false,
        message: "Vehicle ID is already taken. Please use a different one.",
        field: "vehicleId",
      });
    }

    if (error.name === "ValidationError") {
      const errors: Record<string, string> = {};
      for (const key in error.errors) {
        errors[key] = error.errors[key].message;
      }
      return res.status(400).json({ success: false, errors });
    }

    res.status(500).json({ success: false, message: (error as Error).message });
  }
};

// remove specific trip
const removeSpecificTrip = async (req: any, res: any) => {
  try {
    const { id } = req.params ?? {};
    const trip = await Trip.findByIdAndDelete(id);
    if (!trip)
      return res
        .status(404)
        .json({ message: `Cannot find any trip with ID ${id}` });
    res.status(200).json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}


export {
  createTrip,
  getAllTrips,
  getSpecificTrip,
  updateTrip,
  removeSpecificTrip,
  createMultipleTrips
}