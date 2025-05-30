// src/models/report.ts
import mongoose, { Document, Schema } from 'mongoose';
import { REPORT_TYPE, FILE_FORMAT } from '../config/constants';

export interface IReport extends Document {
  reportType: string;
  dateFrom: Date;
  dateTo: Date;
  locationId?: string;
  carId?: string;
  supportAgentId?: string;
  fileFormat: string;
  fileUrl?: string;
  filePath?: string;
  fileName?: string;
  salesData?: {
    carsStatistics: Array<{
      carId: string;
      carModel: string;
      daysRented: number;
      reservationsCount: number;
      mileageStart: number;
      mileageEnd: number;
      totalKilometers: number;
      avgMileagePerReservation: number;
      avgMileageDeltaPercent: number;
      avgFeedback: string;
      minFeedback: string;
      avgFeedbackDeltaPercent: number;
      revenue: number;
      revenueDeltaPercent: number;
    }>;
    locationStatistics?: {
      totalReservations: number;
      totalRevenue: number;
      avgFeedback: string;
      reservationCompletionRate: number;
      popularCars: Array<{
        carId: string;
        carModel: string;
        reservationsCount: number;
      }>;
    };
  };
  supportAgentData?: {
    agentStatistics: Array<{
      agentId: string;
      agentName: string;
      reservationsProcessed: number;
      reservationsProcessedDeltaPercent: number;
      avgFeedback: string;
      minFeedback: string;
      feedbackDeltaPercent: number;
      revenue: number;
      revenueDeltaPercent: number;
    }>;
  };
  sentTo?: Array<{
    email: string;
    sentAt: Date;
  }>;
  createdAt: Date;
  updatedAt: Date;
}

const reportSchema = new Schema(
  {
    reportType: {
      type: String,
      required: true,
      enum: Object.values(REPORT_TYPE),
    },
    dateFrom: {
      type: Date,
      required: true,
    },
    dateTo: {
      type: Date,
      required: true,
    },
    locationId: {
      type: String,
    },
    carId: {
      type: String,
    },
    supportAgentId: {
      type: String,
    },
    fileFormat: {
      type: String,
      required: true,
      enum: Object.values(FILE_FORMAT),
      default: FILE_FORMAT.XLSX,
    },
    fileUrl: {
      type: String,
    },
    filePath: {
      type: String,
    },
    fileName: {
      type: String,
    },
    salesData: {
      carsStatistics: [
        {
          carId: String,
          carModel: String,
          daysRented: Number,
          reservationsCount: Number,
          mileageStart: Number,
          mileageEnd: Number,
          totalKilometers: Number,
          avgMileagePerReservation: Number,
          avgMileageDeltaPercent: Number,
          avgFeedback: String,
          minFeedback: String,
          avgFeedbackDeltaPercent: Number,
          revenue: Number,
          revenueDeltaPercent: Number,
        },
      ],
      locationStatistics: {
        totalReservations: Number,
        totalRevenue: Number,
        avgFeedback: String,
        reservationCompletionRate: Number,
        popularCars: [
          {
            carId: String,
            carModel: String,
            reservationsCount: Number,
          },
        ],
      },
    },
    supportAgentData: {
      agentStatistics: [
        {
          agentId: String,
          agentName: String,
          reservationsProcessed: Number,
          reservationsProcessedDeltaPercent: Number,
          avgFeedback: String,
          minFeedback: String,
          feedbackDeltaPercent: Number,
          revenue: Number,
          revenueDeltaPercent: Number,
        },
      ],
    },
    sentTo: [
      {
        email: String,
        sentAt: Date,
      },
    ],
  },
  { timestamps: true }
);

const Report = mongoose.model<IReport>('Report', reportSchema);

export default Report;