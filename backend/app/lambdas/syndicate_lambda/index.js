/**
 * AWS Lambda handler function
 * @param {Object} event - API Gateway event
 * @returns {Object} API Gateway response
 */
let routes;
let dbInitialized = false;
let dbInitializationInProgress = false;

exports.handler = async (event) => {
  try {
    console.log('Received event:', JSON.stringify(event, null, 2));
   
    // Handle CORS preflight requests
    if (event.httpMethod === 'OPTIONS') {
      return {
        statusCode: 200,
        headers: getCorsHeaders(event.headers || {}),
        body: ''
      };
    }
    
  // Initialize database connection and seed data if not already done
    if (!dbInitialized && !dbInitializationInProgress) {
      try {
        dbInitializationInProgress = true;
        console.log('Initializing database connection and data...');
        
        // Run the database initialization script
        const initDatabase = require('./initDatabase');
        const initResult = await initDatabase();
        
        if (initResult) {
          dbInitialized = true;
          console.log('Database initialized successfully');
        } else {
          console.error('Database initialization failed');
        }
        
        dbInitializationInProgress = false;
      } catch (dbError) {
        dbInitializationInProgress = false;
        console.error('Failed to initialize database:', dbError);
        return buildResponse(500, { 
          message: 'Database initialization error',
          error: process.env.NODE_ENV === 'development' ? dbError.message : 'Internal server error'
        });
      }
    }
   
    // Lazy load routes module
    if (!routes) {
      try {
        console.log('Attempting to load routes module...');
        routes = require('./routes/routes');
        console.log('Routes module loaded successfully');
       
        // Check if routes has the processRequest function
        if (typeof routes.processRequest !== 'function') {
          console.log('processRequest not found directly, checking exports');
         
          // If routes is an object with default property (common when converting from ES modules)
          if (routes.default && typeof routes.default.processRequest === 'function') {
            console.log('Found processRequest in default export, using it');
            routes = routes.default;
          } else {
            throw new Error('processRequest function not found in routes module');
          }
        }
      } catch (error) {
        console.error('Error loading routes module:', error);
        throw error;
      }
    }
   
    const path = event.path;
    const method = event.httpMethod;
    console.log(`Processing ${method || 'TEST'} request to ${path || 'test endpoint'}`);
   
    // If path or method are undefined (like in test events), provide a default response
    if (!path || !method) {
      return buildResponse(200, {
        message: "Car Rental API is running",
        note: "This is a test response. For actual API calls, please provide a valid path and HTTP method.",
        env: {
          mongoDbConnected: dbInitialized,
          nodeEnv: process.env.NODE_ENV || 'not set'
        }
      });
    }
   
    // Validate MongoDB URI before processing request
    if (!process.env.MONGODB_URI) {
      console.error('MONGODB_URI environment variable not set');
      return buildResponse(500, { message: 'Server configuration error: Database connection string not set' });
    }
   
    const response = await routes.processRequest(path, method, event);
    return buildResponse(response.statusCode || 200, response.body);
  } catch (error) {
    console.error('Error processing request:', error);
    return handleError(error);
  }
};
 
/**
 * Get CORS headers
 * @param {Object} requestHeaders - Request headers
 * @returns {Object} CORS headers
 */
const getCorsHeaders = (requestHeaders = {}) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Credentials': true,
    'Access-Control-Allow-Methods': 'GET,HEAD,OPTIONS,POST,PUT,DELETE'
  };
 
  // Handle Access-Control-Request-Headers
  if (requestHeaders['Access-Control-Request-Headers']) {
    headers['Access-Control-Allow-Headers'] = requestHeaders['Access-Control-Request-Headers'];
  } else {
    headers['Access-Control-Allow-Headers'] = 'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token';
  }
 
  return headers;
};
 
/**
 * Builds a standardized API Gateway response
 * @param {number} statusCode - HTTP status code
 * @param {object} body - Response body
 * @returns {object} Formatted response object
 */
const buildResponse = (statusCode, body) => {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      ...getCorsHeaders()
    },
    body: JSON.stringify(body)
  };
};
 
/**
 * Handles errors and returns appropriate responses
 * @param {Error} error - The error object
 * @returns {object} Error response
 */
const handleError = (error) => {
  console.error('Error caught by error handler:', error);
 
  // Handle different types of errors
  if (error.name === 'ValidationError') {
    return buildResponse(400, {
      message: 'Validation error',
      details: error.details || error.message
    });
  }
 
  if (error.name === 'UnauthorizedError') {
    return buildResponse(401, { message: 'Unauthorized access' });
  }
 
  if (error.name === 'ForbiddenError') {
    return buildResponse(403, { message: 'Forbidden access' });
  }
 
  if (error.name === 'NotFoundError') {
    return buildResponse(404, { message: 'Resource not found' });
  }
 
  // Handle MongoDB errors
  if (error.name === 'MongoError' || error.name === 'MongoServerError') {
    if (error.code === 11000) {
      return buildResponse(409, {
        message: 'Duplicate key error',
        details: error.keyValue
      });
    }
    
    return buildResponse(500, { 
      message: 'Database error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
  
  // Handle MongoDB connection errors
  if (error.name === 'MongoNetworkError') {
    return buildResponse(500, { 
      message: 'Database connection error',
      details: process.env.NODE_ENV === 'development' ? error.message : 'Internal server error'
    });
  }
  
  // Handle JWT errors
  if (error.name === 'JsonWebTokenError') {
    return buildResponse(401, { message: 'Invalid token' });
  }
  
  if (error.name === 'TokenExpiredError') {
    return buildResponse(401, { message: 'Token expired' });
  }
 
  // Default to internal server error
  return buildResponse(500, { 
    message: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? error.message : undefined
  });
};