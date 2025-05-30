/**
 * Feedback Model
 * Defines the schema for feedback/reviews data in MongoDB
 */

const mongoose = require('mongoose');
const Schema = mongoose.Schema;

/**
 * Feedback Schema
 * Defines the structure and validation for feedback documents
 */
const feedbackSchema = new Schema({
  // Relations
  clientId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Client ID is required']
  },
  carId: {
    type: Schema.Types.ObjectId,
    ref: 'Car',
    required: [true, 'Car ID is required']
  },
  bookingId: {
    type: Schema.Types.ObjectId,
    ref: 'Booking',
    required: [true, 'Booking ID is required']
  },
  
  // Feedback details
  rating: {
    type: String,
    required: [true, 'Rating is required'],
    validate: {
      validator: function(v) {
        return /^[1-5](\.[0-9])?$/.test(v);
      },
      message: props => `${props.value} is not a valid rating! Must be between 1 and 5`
    }
  },
  feedbackText: {
    type: String,
    required: [true, 'Feedback text is required'],
    trim: true
  },
  
  // Timestamp
  createdAt: {
    type: Date,
    default: Date.now
  }
});

/**
 * Post-save middleware
 * Updates car ratings based on feedback
 */
feedbackSchema.post('save', async function() {
  try {
    const Car = mongoose.model('Car');
    const car = await Car.findById(this.carId);
    
    if (car) {
      // Get all ratings for this car
      const Feedback = mongoose.model('Feedback');
      const allFeedback = await Feedback.find({ carId: this.carId });
      
      if (allFeedback && allFeedback.length > 0) {
        // Calculate average rating
        const sum = allFeedback.reduce((total, item) => {
          return total + parseFloat(item.rating);
        }, 0);
        
        const averageRating = (sum / allFeedback.length).toFixed(1);
        
        // Update car rating
        car.carRating = averageRating;
        await car.save();
      }
    }
  } catch (error) {
    console.error('Error updating car rating:', error);
  }
});

// Create and export the Feedback model
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback;