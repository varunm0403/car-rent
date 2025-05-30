/**
 * User Controller
 * Handles user management operations
 */

const bcrypt = require('bcryptjs');
const { validate, schemas } = require('../utils/validator');
const { connectToDatabase } = require('../config/database');
const User = require('../models/user');
const { authenticate, authorize } = require('../middleware/auth');
const { USER_ROLES } = require('../config/config');
// const { uploadToS3, deleteFromS3 } = require('../utils/s3Utils');

/**
 * Get user profile
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with user profile
 */
const getUserProfile = async (event) => {
  try {
    // Authenticate user
    const authenticatedEvent = await authenticate(event);
    const userId = authenticatedEvent.user.userId;
    
    // Connect to database
    await connectToDatabase();
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      };
    }
    
    // Return user profile without sensitive data
    return {
      statusCode: 200,
      body: JSON.stringify({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        phoneNumber: user.phoneNumber || '',
        country: user.country || '',
        city: user.city || '',
        street: user.street || '',
        postalCode: user.postalCode || '',
        avatar: user.avatar || '',
        drivingLicense: {
          number: user.drivingLicense?.number || '',
          expiryDate: user.drivingLicense?.expiryDate || '',
          documentUrl: user.drivingLicense?.documentUrl || '',
          verified: user.drivingLicense?.verified || false
        },
        passport: {
          number: user.passport?.number || '',
          expiryDate: user.passport?.expiryDate || '',
          documentUrl: user.passport?.documentUrl || '',
          verified: user.passport?.verified || false
        }
      })
    };
  } catch (error) {
    console.error('Error in getUserProfile:', error);
    
    if (error.name === 'UnauthorizedError') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error fetching user profile' })
    };
  }
};

/**
 * Update user personal information
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with updated profile
 */
const updatePersonalInfo = async (event) => {
  try {
    // Authenticate user
    const authenticatedEvent = await authenticate(event);
    const userId = authenticatedEvent.user.userId;
    
    // Parse and validate request body
    const body = JSON.parse(authenticatedEvent.body || '{}');
    const validatedData = validate(body, schemas.updatePersonalInfo);
    
    // Connect to database
    await connectToDatabase();
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      };
    }
    
    // Update allowed fields
    const allowedFields = [
      'firstName', 'lastName', 'phoneNumber', 'country', 
      'city', 'street', 'postalCode'
    ];
    
    allowedFields.forEach(field => {
      if (validatedData[field] !== undefined) {
        user[field] = validatedData[field];
      }
    });
    
    await user.save();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Personal information updated successfully',
        firstName: user.firstName,
        lastName: user.lastName,
        phoneNumber: user.phoneNumber || '',
        country: user.country || '',
        city: user.city || '',
        street: user.street || '',
        postalCode: user.postalCode || ''
      })
    };
  } catch (error) {
    console.error('Error in updatePersonalInfo:', error);
    
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Validation error', details: error.details })
      };
    }
    
    if (error.name === 'UnauthorizedError') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating personal information' })
    };
  }
};

/**
 * Update user avatar
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with updated avatar
 */
const updateAvatar = async (event) => {
  try {
    // Authenticate user
    const authenticatedEvent = await authenticate(event);
    const userId = authenticatedEvent.user.userId;
    
    // Check if file exists in the request
    if (!event.isBase64Encoded || !event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No image file provided' })
      };
    }
    
    // Parse the base64 image
    const imageBuffer = Buffer.from(event.body, 'base64');
    
    // Check file size (max 1MB)
    const fileSizeInMB = imageBuffer.length / (1024 * 1024);
    if (fileSizeInMB > 1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Image file size must be less than 1MB' })
      };
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      };
    }
    
    // Delete old avatar if it exists and is not the default
    if (user.avatar && !user.avatar.includes('default-avatar.png')) {
      try {
        const oldAvatarKey = user.avatar.split('/').pop();
        await deleteFromS3(oldAvatarKey, 'user-avatars');
      } catch (deleteError) {
        console.error('Error deleting old avatar:', deleteError);
        // Continue with upload even if delete fails
      }
    }
    
    // Upload new avatar to S3
    const fileName = `avatar-${userId}-${Date.now()}.jpg`;
    const avatarUrl = await uploadToS3(imageBuffer, fileName, 'image/jpeg', 'user-avatars');
    
    // Update user avatar
    user.avatar = avatarUrl;
    await user.save();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'Avatar updated successfully',
        avatar: avatarUrl
      })
    };
  } catch (error) {
    console.error('Error in updateAvatar:', error);
    
    if (error.name === 'UnauthorizedError') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error updating avatar' })
    };
  }
};

/**
 * Upload document (driving license or passport)
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with uploaded document info
 */
const uploadDocument = async (event) => {
  try {
    // Authenticate user
    const authenticatedEvent = await authenticate(event);
    const userId = authenticatedEvent.user.userId;
    
    // Extract document type from path
    const { documentType } = event.pathParameters || {};
    
    if (!['driving-license', 'passport'].includes(documentType)) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Invalid document type' })
      };
    }
    
    // Check if file exists in the request
    if (!event.isBase64Encoded || !event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'No document file provided' })
      };
    }
    
    // Parse the base64 document
    const documentBuffer = Buffer.from(event.body, 'base64');
    
    // Check file size (max 1MB)
    const fileSizeInMB = documentBuffer.length / (1024 * 1024);
    if (fileSizeInMB > 1) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Document file size must be less than 1MB' })
      };
    }
    
    // Get document metadata from headers or query params
    const contentType = event.headers['content-type'] || 'application/pdf';
    const documentNumber = event.queryStringParameters?.number;
    const expiryDate = event.queryStringParameters?.expiryDate;
    
    if (!documentNumber || !expiryDate) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Document number and expiry date are required' })
      };
    }
    
    // Connect to database
    await connectToDatabase();
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      };
    }
    
    // Determine document field based on type
    const documentField = documentType === 'driving-license' ? 'drivingLicense' : 'passport';
    
    // Delete old document if it exists
    if (user[documentField] && user[documentField].documentUrl) {
      try {
        const oldDocumentKey = user[documentField].documentUrl.split('/').pop();
        await deleteFromS3(oldDocumentKey, 'user-documents');
      } catch (deleteError) {
        console.error(`Error deleting old ${documentField}:`, deleteError);
        // Continue with upload even if delete fails
      }
    }
    
    // Upload document to S3
    const fileName = `${documentType}-${userId}-${Date.now()}.${contentType.split('/')[1] || 'pdf'}`;
    const documentUrl = await uploadToS3(documentBuffer, fileName, contentType, 'user-documents');
    
    // Update user document information
    user[documentField] = {
      number: documentNumber,
      expiryDate: new Date(expiryDate),
      documentUrl: documentUrl,
      verified: false,
      uploadDate: new Date()
    };
    
    await user.save();
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `${documentType.replace('-', ' ')} uploaded successfully`,
        documentType: documentType,
        documentUrl: documentUrl,
        verified: false
      })
    };
  } catch (error) {
    console.error('Error in uploadDocument:', error);
    
    if (error.name === 'UnauthorizedError') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error uploading document' })
    };
  }
};

/**
 * Change user password
 * @param {Object} event - API Gateway event
 * @returns {Promise<Object>} Response with success message
 */
const changePassword = async (event) => {
  try {
    // Authenticate user
    const authenticatedEvent = await authenticate(event);
    const userId = authenticatedEvent.user.userId;
    
    // Parse request body
    const body = JSON.parse(authenticatedEvent.body || '{}');
    const validatedData = validate(body, schemas.changePassword);
    
    // Connect to database
    await connectToDatabase();
    
    // Get user
    const user = await User.findById(userId);
    
    if (!user) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: 'User not found' })
      };
    }
    
    // Verify current password
    const isMatch = await bcrypt.compare(validatedData.currentPassword, user.password);
    if (!isMatch) {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: 'Current password is incorrect' })
      };
    }
    
    // Hash new password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(validatedData.newPassword, salt);
    
    // Update password
    user.password = hashedPassword;
    await user.save();
    
    return {
      statusCode: 200,
      body: JSON.stringify({ message: 'Password changed successfully' })
    };
  } catch (error) {
    console.error('Error in changePassword:', error);
    
    if (error.name === 'ValidationError') {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: 'Validation error', details: error.details })
      };
    }
    
    if (error.name === 'UnauthorizedError') {
      return {
        statusCode: 401,
        body: JSON.stringify({ message: error.message })
      };
    }
    
    return {
      statusCode: 500,
      body: JSON.stringify({ message: 'Error changing password' })
    };
  }
};

// Export all controller functions
module.exports = {
  getUserProfile,
  updatePersonalInfo,
  updateAvatar,
  uploadDocument,
  changePassword,
  // Keep existing exports
  getAllUsers: require('./userController').getAllUsers,
  updateUserRole: require('./userController').updateUserRole,
  getClients: require('./userController').getClients,
  getSupportAgents: require('./userController').getSupportAgents
};