// /**
//  * Report Controller
//  * Handles analytics and report generation
//  */

const { validate, schemas } = require('../utils/validator');
const { connectToDatabase } = require('../config/database');
const Report = require('../models/report');
const Booking = require('../models/booking');
const Car = require('../models/car');
const User = require('../models/user');
const Location = require('../models/location');
const Feedback = require('../models/feedback');
const { authenticate, authorize } = require('../middleware/auth');
const { USER_ROLES, BOOKING_STATUS } = require('../config/config');
const { generateReportFile, sendReportEmail } = require('../utils/reportUtils');

/**
 * Generate a new report
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with generated report
 */
const generateReport = async (event) => {
  try {
    // Authenticate and authorize admin
    const authenticatedEvent = await authorize([USER_ROLES.ADMIN])(event);
    
    // Parse and validate request body
    const body = JSON.parse(authenticatedEvent.body || '{}');
    const validatedData = validate(body, schemas.generateReport);
    
    // Connect to database
    await connectToDatabase();
    
    // Extract report parameters
    const { dateFrom, dateTo, reportType, locationId, carId, supportAgentId, fileFormat } = validatedData;
    const start = new Date(dateFrom);
    const end = new Date(dateTo);
    
    // Create base report object
    const reportData = {
      dateFrom: start,
      dateTo: end,
      reportType: reportType || 'SALES',
      fileFormat: fileFormat || 'XLSX'
    };
    
    // Add optional filters
    if (locationId) reportData.locationId = locationId;
    if (carId) reportData.carId = carId;
    if (supportAgentId) reportData.supportAgentId = supportAgentId;
    
    // Get previous period for delta calculations
    const periodLength = end - start;
    const prevPeriodStart = new Date(start.getTime() - periodLength);
    const prevPeriodEnd = new Date(start);
    
    // Get bookings for current period
    const bookingsFilter = {
      createdAt: { $gte: start, $lte: end }
    };
    
    // Apply filters
    if (locationId) {
      const locationCars = await Car.find({ location: locationId }).select('_id');
      const carIds = locationCars.map(car => car._id);
      bookingsFilter.car = { $in: carIds };
    }
    if (carId) bookingsFilter.car = carId;
    if (supportAgentId) bookingsFilter.agentId = supportAgentId;
    
    const bookings = await Booking.find(bookingsFilter)
      .populate('car', 'make model year pricePerDay')
      .populate('user', 'firstName lastName email');
    
    // Get bookings for previous period
    const prevBookingsFilter = {
      ...bookingsFilter,
      createdAt: { $gte: prevPeriodStart, $lte: prevPeriodEnd }
    };
    
    const prevBookings = await Booking.find(prevBookingsFilter)
      .populate('car', 'make model year pricePerDay')
      .populate('user', 'firstName lastName email');
    
    // Generate report data based on type
    if (reportData.reportType === 'SALES') {
      reportData.salesData = await generateSalesReportData(bookings);
    } else {
      reportData.supportAgentData = await generateSupportAgentReportData(bookings, prevBookings, supportAgentId);
    }
    
    // Save report to database
    const report = new Report(reportData);
    await report.save();
    
    // Generate report file
    const fileUrl = await generateReportFile(report, reportData.fileFormat);
    
    // Update report with file URL
    report.fileUrl = fileUrl;
    report.fileName = `${reportData.reportType}_Report_${start.toISOString().split('T')[0]}_to_${end.toISOString().split('T')[0]}`;
    await report.save();
    
    return {
      statusCode: 201,
      body: JSON.stringify({
        reportId: report._id,
        fileUrl: report.fileUrl,
        fileName: report.fileName,
        reportType: report.reportType,
        dateFrom: report.dateFrom,
        dateTo: report.dateTo
      })
    };
  } catch (error) {
    console.error('Error in generateReport:', error);
    
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Validation error', details: error.details })
      };
    }
    
    if (error.name === 'UnauthorizedError' || error.name === 'ForbiddenError') {
      return {
        statusCode: error.name === 'UnauthorizedError' ? 401 : 403,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error generating report' })
    };
  }
};

/**
 * Generate sales report data
 * @param {Array} bookings - Current period bookings
 * @param {Array} prevBookings - Previous period bookings
 * @param {string} locationId - Location ID filter
 * @param {string} carId - Car ID filter
 * @returns {Object} Sales report data
 */
const generateSalesReportData = async (bookings) => {
  const formattedBookings = await Promise.all(bookings.map(async (booking) => {
    // Format booking period
    const start = new Date(booking.startDate);
    const end = new Date(booking.endDate);
    const bookingPeriod = `${start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    
    // Get car details
    const car = booking.car;
    const carModel = `${car.make} ${car.model}`;
    const carNumber = car.carNumber || 'N/A'; // fallback if field is missing
    
    // Get user details
    const user = booking.user;
    const madeBy = user ? `${user.firstName} ${user.lastName} (Client)` : 'Unknown (Client)';
    
    // Get support agent details
    let supportAgent = 'N/A';
    if (booking.agentId) {
      const agent = await User.findById(booking.agentId).select('firstName lastName');
      if (agent) {
        supportAgent = `${agent.firstName} ${agent.lastName}`;
      }
    }

    // Get feedback rating
    const feedback = await Feedback.findOne({ bookingId: booking._id });
    const carServiceRating = feedback ? feedback.rating.toString() : 'N/A';

    return {
      bookingPeriod,
      carMillageStart: booking.carMileageStart || 0,
      carMillageEnd: booking.carMileageEnd || 0,
      carModel,
      carNumber,
      carServiceRating,
      madeBy,
      reportId: booking._id.toString(),
      supportAgent
    };
  }));

  return {
    content: formattedBookings
  };
};


/**
 * Generate support agent performance report data
 * @param {Array} bookings - Current period bookings
 * @param {Array} prevBookings - Previous period bookings
 * @param {string} supportAgentId - Support agent ID filter
 * @returns {Object} Support agent report data
 */
const generateSupportAgentReportData = async (bookings, prevBookings, supportAgentId) => {
  // Filter bookings created by support agents
  const agentBookings = bookings.filter(booking => 
    booking.createdBy === 'support_agent' && booking.agentId
  );
  
  // Group bookings by agent
  const agentData = {};
  agentBookings.forEach(booking => {
    const agentId = booking.agentId.toString();
    if (!agentData[agentId]) {
      agentData[agentId] = {
        agentId: booking.agentId,
        bookings: [],
        revenue: 0
      };
    }
    agentData[agentId].bookings.push(booking);
    if (booking.status === BOOKING_STATUS.COMPLETED || booking.status === BOOKING_STATUS.SERVICE_COMPLETED) {
      agentData[agentId].revenue += booking.totalPrice;
    }
  });
  
  // Group previous bookings by agent
  const prevAgentData = {};
  prevBookings.filter(booking => booking.createdBy === 'support_agent' && booking.agentId)
    .forEach(booking => {
      const agentId = booking.agentId.toString();
      if (!prevAgentData[agentId]) {
        prevAgentData[agentId] = {
          bookings: [],
          revenue: 0
        };
      }
      prevAgentData[agentId].bookings.push(booking);
      if (booking.status === BOOKING_STATUS.COMPLETED || booking.status === BOOKING_STATUS.SERVICE_COMPLETED) {
        prevAgentData[agentId].revenue += booking.totalPrice;
      }
    });
  
  // Get agent details
  const agentIds = Object.keys(agentData);
  const agents = await User.find({ 
    _id: { $in: agentIds },
    role: USER_ROLES.SUPPORT_AGENT
  }).select('_id firstName lastName');
  
  // Get feedback data for agents
  const feedbackData = {};
  for (const agentId of agentIds) {
    // Get bookings handled by this agent
    const bookingIds = agentData[agentId].bookings.map(b => b._id);
    
    // Get feedback for these bookings
    const feedback = await Feedback.find({ bookingId: { $in: bookingIds } });
    
    if (feedback.length > 0) {
      const ratings = feedback.map(f => parseFloat(f.rating));
      feedbackData[agentId] = {
        avg: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        min: Math.min(...ratings).toFixed(1)
      };
    } else {
      feedbackData[agentId] = { avg: '0.0', min: '0.0' };
    }
  }
  
  // Get previous period feedback data
  const prevFeedbackData = {};
  for (const agentId of Object.keys(prevAgentData)) {
    const bookingIds = prevAgentData[agentId].bookings.map(b => b._id);
    const feedback = await Feedback.find({ bookingId: { $in: bookingIds } });
    
    if (feedback.length > 0) {
      const ratings = feedback.map(f => parseFloat(f.rating));
      prevFeedbackData[agentId] = {
        avg: (ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
        min: Math.min(...ratings).toFixed(1)
      };
    } else {
      prevFeedbackData[agentId] = { avg: '0.0', min: '0.0' };
    }
  }
  
  // Calculate agent statistics
  const agentStatistics = agentIds.map(agentId => {
    const agent = agents.find(a => a._id.toString() === agentId);
    const data = agentData[agentId];
    const prevData = prevAgentData[agentId] || { bookings: [], revenue: 0 };
    
    const reservationsProcessed = data.bookings.length;
    const prevReservationsProcessed = prevData.bookings.length;
    
    const reservationsProcessedDeltaPercent = prevReservationsProcessed > 0 ? 
      ((reservationsProcessed - prevReservationsProcessed) / prevReservationsProcessed * 100).toFixed(2) : 0;
    
    const avgFeedback = feedbackData[agentId].avg;
    const minFeedback = feedbackData[agentId].min;
    const prevMinFeedback = prevFeedbackData[agentId] ? prevFeedbackData[agentId].min : '0.0';
    
    const feedbackDeltaPercent = parseFloat(prevMinFeedback) > 0 ? 
      ((parseFloat(minFeedback) - parseFloat(prevMinFeedback)) / parseFloat(prevMinFeedback) * 100).toFixed(2) : 0;
    
    const revenue = data.revenue;
    const prevRevenue = prevData.revenue;
    
    const revenueDeltaPercent = prevRevenue > 0 ? 
      ((revenue - prevRevenue) / prevRevenue * 100).toFixed(2) : 0;
    
    return {
      agentId: agent._id,
      agentName: agent ? `${agent.firstName} ${agent.lastName}` : 'Unknown Agent',
      reservationsProcessed,
      reservationsProcessedDeltaPercent,
      avgFeedback,
      minFeedback,
      feedbackDeltaPercent,
      revenue,
      revenueDeltaPercent
    };
  });
  
  return { agentStatistics };
};

/**
 * Get all reports
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with reports
 */
const getAllReports = async (event) => {
  try {
    // Authenticate and authorize admin
    const authenticatedEvent = await authorize([USER_ROLES.ADMIN])(event);
    
    // Connect to database
    await connectToDatabase();
    
    // Get reports
    const reports = await Report.find()
      .sort({ createdAt: -1 });
    
    // Format reports for response
    const formattedReports = reports.map(report => ({
      reportId: report._id,
      reportType: report.reportType,
      dateFrom: report.dateFrom,
      dateTo: report.dateTo,
      fileName: report.fileName,
      fileUrl: report.fileUrl,
      createdAt: report.createdAt
    }));
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        content: formattedReports
      })
    };
  } catch (error) {
    console.error('Error in getAllReports:', error);
    
    if (error.name === 'UnauthorizedError' || error.name === 'ForbiddenError') {
      return {
        statusCode: error.name === 'UnauthorizedError' ? 401 : 403,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching reports' })
    };
  }
};

/**
 * Get report by ID
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with report
 */
const getReportById = async (event) => {
  try {
    // Authenticate and authorize admin
    const authenticatedEvent = await authorize([USER_ROLES.ADMIN])(event);
    
    // Extract report ID from path parameters
    const { reportId } = authenticatedEvent.pathParameters || {};
    
    if (!reportId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Report ID is required' })
      };
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Get report
    const report = await Report.findById(reportId);
    
    if (!report) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Report not found' })
      };
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        reportId: report._id,
        reportType: report.reportType,
        dateFrom: report.dateFrom,
        dateTo: report.dateTo,
        fileName: report.fileName,
        fileUrl: report.fileUrl,
        fileFormat: report.fileFormat,
        data: report.reportType === 'SALES' ? report.salesData : report.supportAgentData,
        createdAt: report.createdAt
      })
    };
  } catch (error) {
    console.error('Error in getReportById:', error);
    
    if (error.name === 'UnauthorizedError' || error.name === 'ForbiddenError') {
      return {
        statusCode: error.name === 'UnauthorizedError' ? 401 : 403,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching report' })
    };
  }
};

/**
 * Send report by email
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with email status
 */
const sendReportByEmail = async (event) => {
  try {
    // Authenticate and authorize admin
    const authenticatedEvent = await authorize([USER_ROLES.ADMIN])(event);
    
    // Parse request body
    const body = JSON.parse(authenticatedEvent.body || '{}');
    const { reportId, email } = body;
    
    if (!reportId || !email) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Report ID and email are required' })
      };
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Get report
    const report = await Report.findById(reportId);
    
    if (!report) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'Report not found' })
      };
    }
    
    // Send email
    const emailResult = await sendReportEmail(
      email,
      `CarRent ${report.reportType} Report: ${new Date(report.dateFrom).toLocaleDateString()} to ${new Date(report.dateTo).toLocaleDateString()}`,
      report
    );
    
    // Update report with email info
    report.sentTo.push({
      email,
      sentAt: new Date()
    });
    
    await report.save();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Report sent successfully to ' + email
      })
    };
  } catch (error) {
    console.error('Error in sendReportByEmail:', error);
    
    if (error.name === 'UnauthorizedError' || error.name === 'ForbiddenError') {
      return {
        statusCode: error.name === 'UnauthorizedError' ? 401 : 403,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error sending report' })
    };
  }
};

/**
 * Generate a report based on extension type
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with generated report
 */
const generateReportByExtension = async (event) => {
  try {
    // Authenticate and authorize admin
    const authenticatedEvent = await authorize([USER_ROLES.ADMIN])(event);
    
    // Extract extension from path parameters
    const { extension } = authenticatedEvent.pathParameters || {};
    
    if (!extension || !['sales', 'performance'].includes(extension.toLowerCase())) {
      return {
        statusCode: 400,
        body: JSON.stringify({ 
          message: 'Invalid report type. Use "sales" or "performance".' 
        })
      };
    }
    
    // Parse and validate request body
    const body = JSON.parse(authenticatedEvent.body || '{}');
    const validatedData = validate(body, schemas.generateReport);
    
    // Set report type based on extension
    const reportType = extension.toLowerCase() === 'sales' ? 'SALES' : 'SUPPORT_AGENT_PERFORMANCE';
    
    // Add report type to the validated data
    validatedData.reportType = reportType;
    
    // Call the existing generateReport function with the updated data
    authenticatedEvent.body = JSON.stringify(validatedData);
    return await generateReport(authenticatedEvent);
  } catch (error) {
    console.error('Error in generateReportByExtension:', error);
    
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Validation error', details: error.details })
      };
    }
    
    if (error.name === 'UnauthorizedError' || error.name === 'ForbiddenError') {
      return {
        statusCode: error.name === 'UnauthorizedError' ? 401 : 403,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error generating report' })
    };
  }
};

module.exports = {
  generateReport,
  getAllReports,
  getReportById,
  sendReportByEmail,
  generateReportByExtension
};
