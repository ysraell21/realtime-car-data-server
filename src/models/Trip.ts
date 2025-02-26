import mongoose, { Schema, Document } from 'mongoose';

export interface ITrip extends Document {
  startDateTime: Date;
  endDateTime: Date;
  price: number;
  vehicleId: string;
  startLocation: string;
  endLocation: string;
}

const TripSchema: Schema = new Schema(
  {
    startDateTime: { type: Date, required: [true, 'Please Enter the Start Date & Time'] },
    endDateTime: { type: Date, required: [true, 'Please Enter the End Date & Time'] },
    price: { type: Number, required: [true, 'Please Enter the price'] },
    vehicleId: { type: String, required: [true, 'Please Enter the Vehicle ID'], unique: true },
    startLocation: { type: String, required: [true, 'Please Enter the Start Location'] },
    endLocation: { type: String, required: [true, 'Please Enter the End Location'] },
  },
  { timestamps: true }
);

export default mongoose.model<ITrip>("Trip", TripSchema);
