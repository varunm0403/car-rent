/**
 * Report Model
 * Defines the schema for analytics reports data in MongoDB
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Report Schema
 * Defines the structure for report documents
 */
const reportSchema = new Schema({
  // Report metadata
  dateFrom: {
    type: Date,
    required: [true, 'Start date is required']
  },
  dateTo: {
    type: Date,
    required: [true, 'End date is required']
  },
  reportType: {
    type: String,
    enum: ['SALES', 'SUPPORT_AGENT_PERFORMANCE'],
    required: [true, 'Report type is required']
  },
  locationId: {
    type: Schema.Types.ObjectId,
    ref: 'Location'
  },
  carId: {
    type: Schema.Types.ObjectId,
    ref: 'Car'
  },
  supportAgentId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Sales report data
  salesData: {
    // Car statistics
    carsStatistics: [{
      carId: {
        type: Schema.Types.ObjectId,
        ref: 'Car'
      },
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
      revenueDeltaPercent: Number
    }],
    
    // Location statistics
    locationStatistics: {
      totalReservations: Number,
      totalRevenue: Number,
      avgFeedback: String,
      reservationCompletionRate: Number,
      popularCars: [{
        carId: {
          type: Schema.Types.ObjectId,
          ref: 'Car'
        },
        carModel: String,
        reservationsCount: Number
      }]
    }
  },
  
  // Support agent performance data
  supportAgentData: {
    agentStatistics: [{
      agentId: {
        type: Schema.Types.ObjectId,
        ref: 'User'
      },
      agentName: String,
      reservationsProcessed: Number,
      reservationsProcessedDeltaPercent: Number,
      avgFeedback: String,
      minFeedback: String,
      feedbackDeltaPercent: Number,
      revenue: Number,
      revenueDeltaPercent: Number
    }]
  },
  
  // Report distribution
  sentTo: [{
    email: String,
    sentAt: Date
  }],
  fileUrl: String,
  fileName: String,
  fileFormat: {
    type: String,
    enum: ['CSV', 'XLSX', 'PDF'],
    default: 'XLSX'
  },
  
  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Pre-save middleware to update timestamps
reportSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create and export the Report model
const Report = mongoose.model('Report', reportSchema);

module.exports = Report;