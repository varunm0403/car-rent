import { Request, Response } from 'express';
import logger from '../config/logger';
import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers/responseHelpers';
import { SUCCESS_MESSAGES } from '../utils/constants/successMessages';
import { ERROR_MESSAGES } from '../utils/constants/errorMessages';
import AboutUs from '../models/aboutUs';
import Location from '../models/location';
import Car from '../models/car';
import FAQ from '../models/faq';
import { CarStatus } from '../utils/interfaces/carInterface';

export const getHomePageData = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get about us stories
    const aboutUsStories = await AboutUs.find();
    
    // Get popular cars
    const popularCars = await Car.find({ status: CarStatus.AVAILABLE })
      .sort({ carRating: -1, popularityScore: -1 })
      .limit(8);
    
    // Get locations
    const locations = await Location.find();
    
    // Get FAQs
    const faqs = await FAQ.find();
    
    // Format car data
    const carData = popularCars.map(car => ({
      id: car._id.toString(),
      make: car.make,
      model: car.displayModel,
      year: car.year,
      status: car.status,
      pricePerDay: car.pricePerDay,
      category: car.category,
      imageUrl: car.images[0],
      location: car.location,
      carRating: car.carRating,
      serviceRating: car.serviceRating
    }));
    
    // Format about us data
    const aboutUsData = aboutUsStories.map(story => ({
      title: story.title,
      numericValue: story.numericValue,
      description: story.description
    }));

    // Format location data
    const locationData = locations.map(location => ({
      id: location.id,
      name: location.name,
      address: location.address,
      imageUrl: location.imageUrl,
      lat: location.lat,
      lng: location.lng
    }));
    
    // Format FAQ data
    const faqData = faqs.map(faq => ({
      question: faq.question,
      answer: faq.answer,
      isOpen: faq.isOpen || false
    }));
    
    // Format feedback data (in a real implementation, you would join with user and car collections)
    // const feedbackData = await Promise.all(
    //   recentFeedbacks.map(async (feedback) => {
    //     const car = await Car.findById(feedback.carId);
        
    //     return {
    //       id: feedback._id.toString(),
    //       author: feedback.author || 'Anonymous User',
    //       authorImageUrl: feedback.authorImageUrl || 'https://via.placeholder.com/50',
    //       date: new Date(feedback.createdAt).toLocaleDateString('en-US'),
    //       carModel: car ? car.displayModel : 'Unknown Car',
    //       carImageUrl: car && car.images.length ? car.images[0] : 'https://via.placeholder.com/100',
    //       feedbackText: feedback.feedbackText,
    //       rating: feedback.rating,
    //       orderHistory: feedback.orderHistory || `#${feedback.bookingId.toString().substr(-6)}`
    //     };
    //   })
    // );
    
    sendSuccessResponse(
      res, 
      {
        aboutUs: { content: aboutUsData },
        popularCars: { content: carData },
        locations: { content: locationData },
        faqs: { content: faqData }
        // recentFeedbacks: { content: feedbackData }
      }, 
      SUCCESS_MESSAGES.HOME_PAGE_FETCH_SUCCESS
    );
  } catch (error) {
    logger.error('Error fetching home page data:', error);
    sendErrorResponse(
      res, 
      ERROR_MESSAGES.HOME_PAGE_FETCH_ERROR
    );
  }
};