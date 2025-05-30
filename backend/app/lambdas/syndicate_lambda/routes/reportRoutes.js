/**
 * Report Routes Handler
 * Handles routing for report-related endpoints
 */

const reportController = require('../controllers/reportController');

/**
 * Handle report-related requests
 * @param {string} path - Request path
 * @param {string} method - HTTP method
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response object
 */
const handleRequest = async (path, method, event) => {
  // Normalize path to remove API Gateway stage prefix like '/dev'
  const normalizedPath = path.replace(/^\/dev/, '');
  console.log(`Report route: ${method} ${normalizedPath}`);

  // GET /reports - Get all reports
  if (normalizedPath === '/reports' && method === 'GET') {
    return await reportController.getAllReports(event);
  }

  // POST /reports/sales - Generate sales report
  if (normalizedPath === '/reports/sales' && method === 'POST') {
    event.pathParameters = { ...event.pathParameters, extension: 'sales' };
    return await reportController.generateReportByExtension(event);
  }

  // POST /reports/performance - Generate performance report
  if (normalizedPath === '/reports/performance' && method === 'POST') {
    event.pathParameters = { ...event.pathParameters, extension: 'performance' };
    return await reportController.generateReportByExtension(event);
  }

  // GET /reports/{reportId} - Get report by ID
  const reportIdMatch = normalizedPath.match(/^\/reports\/([a-zA-Z0-9]+)$/);
  if (reportIdMatch && method === 'GET' && reportIdMatch[1] !== 'sales' && reportIdMatch[1] !== 'performance') {
    const reportId = reportIdMatch[1];
    event.pathParameters = { ...event.pathParameters, reportId };
    return await reportController.getReportById(event);
  }

  // POST /reports/email - Send report by email
  if (normalizedPath === '/reports/email' && method === 'POST') {
    return await reportController.sendReportByEmail(event);
  }

  // If no route matches
  return {
    statusCode: 404,
    body: JSON.stringify({
      message: 'Report endpoint not found',
      path,
      method
    })
  };
};