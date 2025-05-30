import { Request, Response } from 'express';
import Location from '../models/location';
import logger from '../config/logger';
import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers/responseHelpers';
import { SUCCESS_MESSAGES } from '../utils/constants/successMessages';
import { ERROR_MESSAGES } from '../utils/constants/errorMessages';
import { ILocationResponse } from '../utils/interfaces/locationInterface';

export const getLocations = async (req: Request, res: Response): Promise<void> => {
  try {
    const locations = await Location.find();
    
    if (!locations.length) {
      sendErrorResponse(res, ERROR_MESSAGES.LOCATION_NOT_FOUND, 404);
      return;
    }
    
    const responseData: ILocationResponse[] = locations.map((location) => ({
      id: location.id,
      name: location.name,
      address: location.address,
      imageUrl: location.imageUrl,
      lat: location.lat,
      lng: location.lng
    }));
    
    sendSuccessResponse(
      res, 
      { content: responseData }, 
      SUCCESS_MESSAGES.LOCATION_FETCH_SUCCESS
    );
  } catch (error) {
    logger.error('Error fetching locations:', error);
    sendErrorResponse(
      res, 
      ERROR_MESSAGES.LOCATION_FETCH_ERROR
    );
  }
};