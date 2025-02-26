import { Request, Response } from 'express';
import Trip from '../models/Trip';

// get average trip price per month
const getAverageTripPricePerMonth = async (_: any, res: Response) => {
  try {
    const currentYear = new Date().getFullYear();

    const result = await Trip.aggregate([
      {
        $match: {
          startDateTime: {
            $gte: new Date(`${currentYear}-01-01T00:00:00.000Z`), 
            $lt: new Date(`${currentYear + 1}-01-01T00:00:00.000Z`),
          },
        },
      },
      {
        $group: {
          _id: { month: { $month: "$startDateTime" } },
          totalRevenue: { $sum: "$price" },
          totalTrips: { $sum: 1 },
        },
      },
      {
        $project: {
          _id: 0,
          month: "$_id.month",
          avgTripPrice: {
            $cond: {
              if: { $eq: ["$totalTrips", 0] },
              then: 0,
              else: { $divide: ["$totalRevenue", "$totalTrips"] },
            },
          },
        },
      },
      { $sort: { month: 1 } },
    ]);

    res.status(200).json(result);

  } catch (error) {
    res.status(500).json({ success: false, message: (error as Error).message });
  }
}

export { getAverageTripPricePerMonth };