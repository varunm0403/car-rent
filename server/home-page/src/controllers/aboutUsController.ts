import { Request, Response } from 'express';
import AboutUs from '../models/aboutUs';
import logger from '../config/logger';
import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers/responseHelpers';
import { SUCCESS_MESSAGES } from '../utils/constants/successMessages';
import { ERROR_MESSAGES } from '../utils/constants/errorMessages';
import { IAboutUsResponse } from '../utils/interfaces/aboutUsInterface';

export const getAboutUs = async (req: Request, res: Response): Promise<void> => {
  try {
    const aboutUsStories = await AboutUs.find();
    
    if (!aboutUsStories.length) {
      sendErrorResponse(res, ERROR_MESSAGES.ABOUT_US_NOT_FOUND, 404);
      return;
    }
    
    const responseData: IAboutUsResponse[] = aboutUsStories.map((story) => ({
      title: story.title,
      numericValue: story.numericValue,
      description: story.description,
    }));
    
    sendSuccessResponse(
      res, 
      { content: responseData }, 
      SUCCESS_MESSAGES.ABOUT_US_FETCH_SUCCESS
    );
  } catch (error) {
    logger.error('Error fetching about us stories:', error);
    sendErrorResponse(
      res, 
      ERROR_MESSAGES.ABOUT_US_FETCH_ERROR
    );
  }
};