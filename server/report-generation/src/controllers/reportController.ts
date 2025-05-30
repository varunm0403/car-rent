import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import path from 'path';
import Report from '../models/report';
import { ApiError } from '../middlewares/errorMiddleware'; // Changed from AppError to ApiError
import { BOOKING_STATUS, REPORT_TYPE, FILE_FORMAT, STORAGE_CONFIG } from '../config/constants';
import { generateReportFile, sendReportEmail } from '../utils/reportUtils';
import logger from '../utils/logger';
import { getBookingsByDateRange } from '../services/bookingService';
import { getCarById, getCarsByLocation } from '../services/carService';
import { getUserById, getSupportAgents } from '../services/userService';
import { getFeedbackByBookingId, getFeedbacksByBookingIds } from '../services/feedbackService';

// Define interfaces for the data we're working with
interface Agent {
  _id: string;
  firstName: string;
  lastName: string;
}

interface Feedback {
  _id: string;
  rating: string;
  feedbackText: string;
  bookingId: string;
}

interface CarStatistics {
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
}

interface LocationStatistics {
  totalReservations: number;
  totalRevenue: number;
  avgFeedback: string;
  reservationCompletionRate: number;
  popularCars: {
    carId: string;
    carModel: string;
    reservationsCount: number;
  }[];
}

interface AgentStatistics {
  agentId: string;
  agentName: string;
  reservationsProcessed: number;
  reservationsProcessedDeltaPercent: number;
  avgFeedback: string;
  minFeedback: string;
  feedbackDeltaPercent: number;
  revenue: number;
  revenueDeltaPercent: number;
}

interface SalesReportData {
  carsStatistics: CarStatistics[];
  locationStatistics?: LocationStatistics;
}

interface SupportAgentReportData {
  agentStatistics: AgentStatistics[];
}

/**
 * Generate a report based on provided parameters
 * @route POST /api/reports
 */
export const generateReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { dateFrom, dateTo, reportType, locationId, carId, supportAgentId, fileFormat } = req.body;

    // Validate dates
    const start = new Date(dateFrom);
    const end = new Date(dateTo);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      throw new ApiError(400, 'Invalid date format'); // Changed from AppError to ApiError
    }

    if (start > end) {
      throw new ApiError(400, 'Start date must be before end date'); // Changed from AppError to ApiError
    }

    // Create report object
    const reportData: any = {
      dateFrom: start,
      dateTo: end,
      reportType: reportType || REPORT_TYPE.SALES,
      fileFormat: fileFormat || FILE_FORMAT.XLSX,
    };

    // Add optional filters
    if (locationId) reportData.locationId = locationId;
    if (carId) reportData.carId = carId;
    if (supportAgentId) reportData.supportAgentId = supportAgentId;

    // Get previous period for delta calculations
    const periodLength = end.getTime() - start.getTime();
    const prevPeriodStart = new Date(start.getTime() - periodLength);
    const prevPeriodEnd = new Date(start);

    // Get JWT token from request
    const token = req.headers.authorization?.split(' ')[1] || '';

    // Build booking filter for current period
    const bookingsFilter: any = {
      pickupDate: { $gte: start.toISOString() },
      dropoffDate: { $lte: end.toISOString() }
    };

    // Apply additional filters
    if (carId) bookingsFilter.carId = carId;
    if (supportAgentId) bookingsFilter.agentId = supportAgentId;

    // Get bookings for current period
    const bookings = await getBookingsByDateRange(start, end, bookingsFilter, token);

    // Get bookings for previous period
    const prevBookings = await getBookingsByDateRange(prevPeriodStart, prevPeriodEnd, bookingsFilter, token);

    // Generate report data based on type
    if (reportData.reportType === REPORT_TYPE.SALES) {
      reportData.salesData = await generateSalesReportData(bookings, prevBookings, locationId, token);
    } else {
      reportData.supportAgentData = await generateSupportAgentReportData(
        bookings,
        prevBookings,
        supportAgentId,
        token
      );
    }

    // Save report to database
    const report = new Report(reportData);
    await report.save();

    // Generate report file
    const fileUrl = await generateReportFile(report, reportData.fileFormat);

    // Update report with file info
    report.fileUrl = fileUrl;
    report.filePath = path.join(STORAGE_CONFIG.reportsDir, path.basename(fileUrl));
    report.fileName = `${reportData.reportType}_Report_${start.toISOString().split('T')[0]}_to_${end
      .toISOString()
      .split('T')[0]}.${reportData.fileFormat.toLowerCase()}`;
    await report.save();

    res.status(201).json({
      status: 'success',
      data: {
        reportId: report._id,
        fileUrl: report.fileUrl,
        fileName: report.fileName,
        reportType: report.reportType,
        dateFrom: report.dateFrom,
        dateTo: report.dateTo,
      },
    });
  } catch (error) {
    logger.error('Error generating report:', error);
    next(error);
  }
};

/**
 * Get all reports
 * @route GET /api/reports
 */
export const getAllReports = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const reports = await Report.find().sort({ createdAt: -1 });

    // Format reports for response
    const formattedReports = reports.map((report) => ({
      reportId: report._id,
      reportType: report.reportType,
      dateFrom: report.dateFrom,
      dateTo: report.dateTo,
      fileName: report.fileName,
      fileUrl: report.fileUrl,
      createdAt: report.createdAt,
    }));

    res.status(200).json({
      status: 'success',
      results: formattedReports.length,
      data: {
        reports: formattedReports,
      },
    });
  } catch (error) {
    logger.error('Error getting all reports:', error);
    next(error);
  }
};

/**
 * Get report by ID
 * @route GET /api/reports/:id
 */
export const getReportById = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;

    const report = await Report.findById(id);

    if (!report) {
      throw new ApiError(404, 'Report not found'); // Changed from AppError to ApiError
    }

    res.status(200).json({
      status: 'success',
      data: {
        report: {
          reportId: report._id,
          reportType: report.reportType,
          dateFrom: report.dateFrom,
          dateTo: report.dateTo,
          fileName: report.fileName,
          fileUrl: report.fileUrl,
          fileFormat: report.fileFormat,
          data: report.reportType === REPORT_TYPE.SALES ? report.salesData : report.supportAgentData,
          createdAt: report.createdAt,
        },
      },
    });
  } catch (error) {
    logger.error('Error getting report by ID:', error);
    next(error);
  }
};

/**
 * Send report by email
 * @route POST /api/reports/:id/email
 */
export const sendReportByEmail = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { email } = req.body;

    if (!email) {
      throw new ApiError(400, 'Email is required'); // Changed from AppError to ApiError
    }

    const report = await Report.findById(id);

    if (!report) {
      throw new ApiError(404, 'Report not found'); // Changed from AppError to ApiError
    }

    // Send email
    await sendReportEmail(
      email,
      `CarRent ${report.reportType} Report: ${new Date(report.dateFrom).toLocaleDateString()} to ${new Date(
        report.dateTo
      ).toLocaleDateString()}`,
      report
    );

    // Update report with email info
    report.sentTo = report.sentTo || [];
    report.sentTo.push({
      email,
      sentAt: new Date(),
    });

    await report.save();

    res.status(200).json({
      status: 'success',
      message: `Report sent successfully to ${email}`,
    });
  } catch (error) {
    logger.error('Error sending report by email:', error);
    next(error);
  }
};

/**
 * Generate a report by type (sales or performance)
 * @route POST /api/reports/:type
 */
export const generateReportByType = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { type } = req.params;

    if (!type || !['sales', 'performance'].includes(type.toLowerCase())) {
      throw new ApiError(400, 'Invalid report type. Use "sales" or "performance".'); // Changed from AppError to ApiError
    }

    // Set report type based on path parameter
    req.body.reportType = type.toLowerCase() === 'sales' ? REPORT_TYPE.SALES : REPORT_TYPE.SUPPORT_AGENT_PERFORMANCE;

    // Call the existing generateReport function
    await generateReport(req, res, next);
  } catch (error) {
    logger.error('Error generating report by type:', error);
    next(error);
  }
};

/**
 * Download report file
 * @route GET /api/reports/:id/download
 */
export const downloadReport = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    
    const report = await Report.findById(id);
    
    if (!report) {
      throw new ApiError(404, 'Report not found'); // Changed from AppError to ApiError
    }
    
    if (!report.filePath) {
      throw new ApiError(404, 'Report file not found'); // Changed from AppError to ApiError
    }
    
    const filePath = path.resolve(report.filePath);
    
    res.download(filePath, report.fileName || 'report.xlsx', (err) => {
      if (err) {
        logger.error('Error downloading file:', err);
        next(new ApiError(500, 'Error downloading file')); // Changed from AppError to ApiError
      }
    });
  } catch (error) {
    logger.error('Error in download report:', error);
    next(error);
  }
};

/**
 * Generate sales report data
 */
const generateSalesReportData = async (
  bookings: any[],
  prevBookings: any[],
  locationId?: string,
  token?: string
): Promise<SalesReportData> => {
  // Group bookings by car
  const carBookings: { [key: string]: any[] } = {};
  
  bookings.forEach((booking) => {
    const carId = booking.car._id.toString();
    if (!carBookings[carId]) {
      carBookings[carId] = [];
    }
    carBookings[carId].push(booking);
  });

  // Group previous bookings by car
  const prevCarBookings: { [key: string]: any[] } = {};
  
  prevBookings.forEach((booking) => {
    const carId = booking.car._id.toString();
    if (!prevCarBookings[carId]) {
      prevCarBookings[carId] = [];
    }
    prevCarBookings[carId].push(booking);
  });

  // Calculate car statistics
  const carsStatistics: CarStatistics[] = await Promise.all(
    Object.keys(carBookings).map(async (carId) => {
      const currentBookings = carBookings[carId];
      const prevCarBookingsList = prevCarBookings[carId] || [];
      
      // Get car details from first booking
      const car = currentBookings[0].car;
      
      // Calculate days rented
      const daysRented = currentBookings.reduce((total, booking) => {
        const start = new Date(booking.pickupDate);
        const end = new Date(booking.dropoffDate);
        return total + Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      }, 0);
      
      // Get mileage data
      const completedBookings = currentBookings.filter(
        (b) => b.status === BOOKING_STATUS.COMPLETED || b.status === BOOKING_STATUS.SERVICE_COMPLETED
      );
      
      let mileageStart = 0;
      let mileageEnd = 0;
      
      if (completedBookings.length > 0) {
        // Find earliest and latest bookings
        const sortedBookings = [...completedBookings].sort(
          (a, b) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime()
        );
        
        mileageStart = sortedBookings[0].carMileageStart || 0;
        mileageEnd = sortedBookings[sortedBookings.length - 1].carMileageEnd || 0;
      }
      
      const totalKilometers = mileageEnd - mileageStart;
      
      // Calculate average mileage per reservation
      const avgMileagePerReservation = completedBookings.length > 0 ? totalKilometers / completedBookings.length : 0;
      
      // Calculate previous period mileage
      const prevCompletedBookings = prevCarBookingsList.filter(
        (b) => b.status === BOOKING_STATUS.COMPLETED || b.status === BOOKING_STATUS.SERVICE_COMPLETED
      );
      
      let prevAvgMileagePerReservation = 0;
      
      if (prevCompletedBookings.length > 0) {
        const prevSortedBookings = [...prevCompletedBookings].sort(
          (a, b) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime()
        );
        
        const prevMileageStart = prevSortedBookings[0].carMileageStart || 0;
        const prevMileageEnd = prevSortedBookings[prevSortedBookings.length - 1].carMileageEnd || 0;
        const prevTotalKilometers = prevMileageEnd - prevMileageStart;
        
        prevAvgMileagePerReservation = prevTotalKilometers / prevCompletedBookings.length;
      }
      
      // Calculate mileage delta
      const avgMileageDeltaPercent = prevAvgMileagePerReservation > 0 
        ? ((avgMileagePerReservation - prevAvgMileagePerReservation) / prevAvgMileagePerReservation * 100) 
        : 0;
      
      // Get feedback data
      const bookingIds = currentBookings.map((b) => b._id);
      const feedbacks = await getFeedbacksByBookingIds(bookingIds, token || '');
      
      let avgFeedback = '0.0';
      let minFeedback = '0.0';
      
      if (feedbacks && feedbacks.length > 0) {
        const ratings = feedbacks.map((f) => parseFloat(f.rating));
        avgFeedback = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
        minFeedback = Math.min(...ratings).toFixed(1);
      }
      
      // Get previous period feedback
      const prevBookingIds = prevCarBookingsList.map((b) => b._id);
      const prevFeedbacks = await getFeedbacksByBookingIds(prevBookingIds, token || '');
      
      let prevAvgFeedback = 0;
      
      if (prevFeedbacks && prevFeedbacks.length > 0) {
        const prevRatings = prevFeedbacks.map((f) => parseFloat(f.rating));
        prevAvgFeedback = prevRatings.reduce((a, b) => a + b, 0) / prevRatings.length;
      }
      
      // Calculate feedback delta
      const avgFeedbackDeltaPercent = prevAvgFeedback > 0 
        ? ((parseFloat(avgFeedback) - prevAvgFeedback) / prevAvgFeedback * 100) 
        : 0;
      
      // Calculate revenue
      const revenue = currentBookings.reduce((total, booking) => {
        return total + (booking.totalPrice || 0);
      }, 0);
      
      // Calculate previous period revenue
      const prevRevenue = prevCarBookingsList.reduce((total, booking) => {
        return total + (booking.totalPrice || 0);
      }, 0);
      
      // Calculate revenue delta
      const revenueDeltaPercent = prevRevenue > 0 
        ? ((revenue - prevRevenue) / prevRevenue * 100) 
        : 0;
      
      return {
        carId,
        carModel: `${car.make} ${car.displayModel} (${car.year})`,
        daysRented,
        reservationsCount: currentBookings.length,
        mileageStart,
        mileageEnd,
        totalKilometers,
        avgMileagePerReservation: parseFloat(avgMileagePerReservation.toFixed(2)),
        avgMileageDeltaPercent: parseFloat(avgMileageDeltaPercent.toFixed(2)),
        avgFeedback,
        minFeedback,
        avgFeedbackDeltaPercent: parseFloat(avgFeedbackDeltaPercent.toFixed(2)),
        revenue,
        revenueDeltaPercent: parseFloat(revenueDeltaPercent.toFixed(2)),
      };
    })
  );

  // Calculate location statistics if locationId is provided
  let locationStatistics: LocationStatistics | undefined = undefined;
  
  if (locationId) {
    // Calculate total reservations and revenue
    const totalReservations = bookings.length;
    const totalRevenue = bookings.reduce((total, booking) => total + (booking.totalPrice || 0), 0);
    
    // Calculate completion rate
    const completedBookings = bookings.filter(
      (b) => b.status === BOOKING_STATUS.COMPLETED || b.status === BOOKING_STATUS.SERVICE_COMPLETED
    );
    const reservationCompletionRate = totalReservations > 0 
      ? (completedBookings.length / totalReservations * 100) 
      : 0;
    
    // Calculate average feedback
    const bookingIds = bookings.map((b) => b._id);
    const feedbacks = await getFeedbacksByBookingIds(bookingIds, token || '');
    
    let avgFeedback = '0.0';
    
    if (feedbacks && feedbacks.length > 0) {
      const ratings = feedbacks.map((f) => parseFloat(f.rating));
      avgFeedback = (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1);
    }
    
    // Find popular cars
    const carReservationCounts: { [key: string]: { carId: string; carModel: string; count: number } } = {};
    
    bookings.forEach((booking) => {
      const carId = booking.car._id.toString();
      const carModel = `${booking.car.make} ${booking.car.displayModel} (${booking.car.year})`;
      
      if (!carReservationCounts[carId]) {
        carReservationCounts[carId] = { carId, carModel, count: 0 };
      }
      
      carReservationCounts[carId].count += 1;
    });
    
    const popularCars = Object.values(carReservationCounts)
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
      .map((item) => ({
        carId: item.carId,
        carModel: item.carModel,
        reservationsCount: item.count,
      }));
    
    locationStatistics = {
      totalReservations,
      totalRevenue,
      avgFeedback,
      reservationCompletionRate: parseFloat(reservationCompletionRate.toFixed(2)),
      popularCars,
    };
  }

  return {
    carsStatistics,
    locationStatistics,
  };
};

/**
 * Generate support agent performance report data
 */
const generateSupportAgentReportData = async (
  bookings: any[],
  prevBookings: any[],
  supportAgentId?: string,
  token?: string
): Promise<SupportAgentReportData> => {
  // Filter bookings created by support agents
  const agentBookings = bookings.filter(
    (booking) => booking.createdBy === 'support_agent' && booking.agentId
  );

  // Group bookings by agent
  const agentData: { [key: string]: { agentId: string; bookings: any[]; revenue: number } } = {};
  
  agentBookings.forEach((booking) => {
    const agentId = booking.agentId.toString();
    
    if (!agentData[agentId]) {
      agentData[agentId] = {
        agentId,
        bookings: [],
        revenue: 0,
      };
    }
    
    agentData[agentId].bookings.push(booking);
    
    if (booking.status === BOOKING_STATUS.COMPLETED || booking.status === BOOKING_STATUS.SERVICE_COMPLETED) {
      agentData[agentId].revenue += booking.totalPrice || 0;
    }
  });

  // Group previous bookings by agent
  const prevAgentData: { [key: string]: { bookings: any[]; revenue: number } } = {};
  
  prevBookings
    .filter((booking) => booking.createdBy === 'support_agent' && booking.agentId)
    .forEach((booking) => {
      const agentId = booking.agentId.toString();
      
      if (!prevAgentData[agentId]) {
        prevAgentData[agentId] = {
          bookings: [],
          revenue: 0,
        };
      }
      
      prevAgentData[agentId].bookings.push(booking);
      
      if (booking.status === BOOKING_STATUS.COMPLETED || booking.status === BOOKING_STATUS.SERVICE_COMPLETED) {
        prevAgentData[agentId].revenue += booking.totalPrice || 0;
      }
    });

  // Filter by specific agent if provided
  let agentIds = Object.keys(agentData);
  
  if (supportAgentId) {
    agentIds = agentIds.filter((id) => id === supportAgentId.toString());
  }

  // Get agent details using service
  const agents: Agent[] = [];
  for (const agentId of agentIds) {
    try {
      const agent = await getUserById(agentId, token || '');
      if (agent) {
        agents.push({
          _id: agentId,
          firstName: agent.firstName,
          lastName: agent.lastName
        });
      }
    } catch (error) {
      logger.error(`Error fetching agent details for ${agentId}:`, error);
    }
  }

  // Get feedback data for agents
  const feedbackData: { [key: string]: { avg: string; min: string } } = {};
  
  for (const agentId of agentIds) {
    // Get bookings handled by this agent
    const bookingIds = agentData[agentId].bookings.map((b) => b._id);
    
    // Get feedback for these bookings
    const feedbacks = await getFeedbacksByBookingIds(bookingIds, token || '');
    
    if (feedbacks && feedbacks.length > 0) {
      const ratings = feedbacks.map((f) => parseFloat(f.rating));
      feedbackData[agentId] = {
        avg: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        min: Math.min(...ratings).toFixed(1),
      };
    } else {
      feedbackData[agentId] = { avg: '0.0', min: '0.0' };
    }
  }

  // Get previous period feedback data
  const prevFeedbackData: { [key: string]: { avg: string; min: string } } = {};
  
  for (const agentId of Object.keys(prevAgentData)) {
    const bookingIds = prevAgentData[agentId].bookings.map((b) => b._id);
    const feedbacks = await getFeedbacksByBookingIds(bookingIds, token || '');
    
    if (feedbacks && feedbacks.length > 0) {
      const ratings = feedbacks.map((f) => parseFloat(f.rating));
      prevFeedbackData[agentId] = {
        avg: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        min: Math.min(...ratings).toFixed(1),
      };
    } else {
      prevFeedbackData[agentId] = { avg: '0.0', min: '0.0' };
    }
  }

  // Calculate agent statistics
  const agentStatistics: AgentStatistics[] = agentIds.map((agentId) => {
    const agent = agents.find((a) => a._id.toString() === agentId);
    const data = agentData[agentId];
    const prevData = prevAgentData[agentId] || { bookings: [], revenue: 0 };
    
    const reservationsProcessed = data.bookings.length;
    const prevReservationsProcessed = prevData.bookings.length;
    
    const reservationsProcessedDeltaPercent = prevReservationsProcessed > 0
      ? ((reservationsProcessed - prevReservationsProcessed) / prevReservationsProcessed * 100)
      : 0;
    
    const avgFeedback = feedbackData[agentId]?.avg || '0.0';
    const minFeedback = feedbackData[agentId]?.min || '0.0';
    const prevMinFeedback = prevFeedbackData[agentId]?.min || '0.0';
    
    const feedbackDeltaPercent = parseFloat(prevMinFeedback) > 0
      ? ((parseFloat(minFeedback) - parseFloat(prevMinFeedback)) / parseFloat(prevMinFeedback) * 100)
      : 0;
    
    const revenue = data.revenue;
    const prevRevenue = prevData.revenue;
    
    const revenueDeltaPercent = prevRevenue > 0 
      ? ((revenue - prevRevenue) / prevRevenue * 100) 
      : 0;
    
    return {
      agentId,
      agentName: agent ? `${agent.firstName} ${agent.lastName}` : 'Unknown Agent',
      reservationsProcessed,
      reservationsProcessedDeltaPercent: parseFloat(reservationsProcessedDeltaPercent.toFixed(2)),
      avgFeedback,
      minFeedback,
      feedbackDeltaPercent: parseFloat(feedbackDeltaPercent.toFixed(2)),
      revenue,
      revenueDeltaPercent: parseFloat(revenueDeltaPercent.toFixed(2)),
    };
  });

  return { agentStatistics };
};