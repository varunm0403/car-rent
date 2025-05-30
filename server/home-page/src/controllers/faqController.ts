import { Request, Response } from 'express';
import FAQ from '../models/faq';
import logger from '../config/logger';
import { sendSuccessResponse, sendErrorResponse } from '../utils/helpers/responseHelpers';
import { SUCCESS_MESSAGES } from '../utils/constants/successMessages';
import { ERROR_MESSAGES } from '../utils/constants/errorMessages';
import { IFAQResponse } from '../utils/interfaces/faqInterface';

export const getFAQs = async (req: Request, res: Response): Promise<void> => {
  try {
    const faqs = await FAQ.find();
    
    if (!faqs.length) {
      sendErrorResponse(res, ERROR_MESSAGES.FAQ_NOT_FOUND, 404);
      return;
    }
    
    const responseData: IFAQResponse[] = faqs.map((faq) => ({
      question: faq.question,
      answer: faq.answer,
      isOpen: faq.isOpen || false
    }));
    
    sendSuccessResponse(
      res, 
      { content: responseData }, 
      SUCCESS_MESSAGES.FAQ_FETCH_SUCCESS
    );
  } catch (error) {
    logger.error('Error fetching FAQs:', error);
    sendErrorResponse(
      res, 
      ERROR_MESSAGES.FAQ_FETCH_ERROR
    );
  }
};