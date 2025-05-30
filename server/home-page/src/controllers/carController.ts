import { Request, Response } from 'express';
import Car from '../models/car';
import logger from '../config/logger';
import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers/responseHelpers';
import { SUCCESS_MESSAGES } from '../utils/constants/successMessages';
import { ERROR_MESSAGES } from '../utils/constants/errorMessages';
import { ICarResponse } from '../utils/interfaces/carInterface';
import { CarStatus } from '../utils/interfaces/carInterface';

export const getPopularCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, limit = 8 } = req.query;
    
    const query: any = { status: CarStatus.AVAILABLE };
    
    if (category) {
      query.category = category.toString().toUpperCase();
    }
    
    const popularCars = await Car.find(query)
      .sort({ carRating: -1, popularityScore: -1 })
      .limit(Number(limit));
    
    if (!popularCars.length) {
      sendErrorResponse(res, ERROR_MESSAGES.CAR_NOT_FOUND, 404);
      return;
    }
    
     const responseData: ICarResponse[] = popularCars.map((car) => ({
      id: car._id.toString(),
      make: car.make,
      year: car.year,
      status: car.status,
      engineCapacity: car.engineCapacity,
      passengerCapacity: car.passengerCapacity,
      fuelConsumption: car.fuelConsumption,
      fuelType: car.fuelType,
      gearBoxType: car.gearBoxType,
      climateControlOption: car.climateControlOption,
      pricePerDay: car.pricePerDay,
      category: car.category,
      images: car.images,
      location: car.location,
      carRating: car.carRating,
      serviceRating: car.serviceRating,
      displayModel: car.displayModel,
      popularityScore: car.popularityScore
    }));
    
    sendSuccessResponse(
      res, 
      { content: responseData }, 
      SUCCESS_MESSAGES.POPULAR_CARS_FETCH_SUCCESS
    );
  } catch (error) {
    logger.error('Error fetching popular cars:', error);
    sendErrorResponse(
      res, 
      ERROR_MESSAGES.CAR_FETCH_ERROR
    );
  }
};

export const getAllCars = async (req: Request, res: Response): Promise<void> => {
  try {
    const { category, status, page = 1, limit = 10 } = req.query;
    
    const query: any = {};
    
    if (category) {
      query.category = category.toString().toUpperCase();
    }
    
    if (status) {
      query.status = status.toString().toUpperCase();
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const [cars, total] = await Promise.all([
      Car.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Car.countDocuments(query)
    ]);
    
    if (!cars.length) {
      sendErrorResponse(res, ERROR_MESSAGES.CAR_NOT_FOUND, 404);
      return;
    }


    const responseData: ICarResponse[] = cars.map((car) => ({
      id: car._id.toString(),
      make: car.make,
      year: car.year,
      status: car.status,
      engineCapacity: car.engineCapacity,
      passengerCapacity: car.passengerCapacity,
      fuelConsumption: car.fuelConsumption,
      fuelType: car.fuelType,
      gearBoxType: car.gearBoxType,
      climateControlOption: car.climateControlOption,
      pricePerDay: car.pricePerDay,
      category: car.category,
      images: car.images,
      location: car.location,
      carRating: car.carRating,
      serviceRating: car.serviceRating,
      displayModel: car.displayModel,
      popularityScore: car.popularityScore
    }));
    
    const totalPages = Math.ceil(total / Number(limit));
    
    sendSuccessResponse(
      res, 
      { 
        content: responseData,
        total,
        page: Number(page),
        limit: Number(limit),
        pages: totalPages
      }, 
      SUCCESS_MESSAGES.CAR_FETCH_SUCCESS
    );
  } catch (error) {
    logger.error('Error fetching cars:', error);
    sendErrorResponse(
      res, 
      ERROR_MESSAGES.CAR_FETCH_ERROR
    );
  }
};

export const getCarById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { carId } = req.params;

    const car = await Car.findById(carId);

    if (!car) {
      sendErrorResponse(res, ERROR_MESSAGES.CAR_NOT_FOUND, 404);
      return;
    }


    const responseData: ICarResponse = {
      id: car._id.toString(),
      make: car.make,
      year: car.year,
      status: car.status,
      engineCapacity: car.engineCapacity,
      passengerCapacity: car.passengerCapacity,
      fuelConsumption: car.fuelConsumption,
      fuelType: car.fuelType,
      gearBoxType: car.gearBoxType,
      climateControlOption: car.climateControlOption,
      pricePerDay: car.pricePerDay,
      category: car.category,
      images: car.images,
      location: car.location,
      carRating: car.carRating,
      serviceRating: car.serviceRating,
      displayModel: car.displayModel,
      popularityScore: car.popularityScore
    };

    sendSuccessResponse(
      res,
      responseData,
      SUCCESS_MESSAGES.CAR_FETCH_SUCCESS
    );
  } catch (error) {
    logger.error('Error fetching car by ID:', error);
    sendErrorResponse(
      res,
      ERROR_MESSAGES.CAR_FETCH_ERROR
    );
  }
};