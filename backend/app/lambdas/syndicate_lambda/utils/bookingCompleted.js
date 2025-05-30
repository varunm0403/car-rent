/**
 * Email Service
 * Handles sending emails for various application events
 */

const nodemailer = require('nodemailer');
const { EMAIL_CONFIG } = require('../config/config');

// Create transporter
const transporter = nodemailer.createTransport({
  host: EMAIL_CONFIG.host,
  port: EMAIL_CONFIG.port,
  secure: EMAIL_CONFIG.secure,
  auth: EMAIL_CONFIG.auth
});

/**
 * Send booking completion email
 * @param {string} email - Recipient email
 * @param {Object} bookingDetails - Booking details
 * @returns {Promise<Object>} Email send result
 */
const sendBookingCompletionEmail = async (email, bookingDetails) => {
  const { bookingNumber, carModel, startDate, endDate, totalPrice } = bookingDetails;
  
  const mailOptions = {
    from: `"CarRent Service" <${EMAIL_CONFIG.auth.user}>`,
    to: email,
    subject: `Your CarRent booking #${bookingNumber} is now complete`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2>Thank you for using CarRent!</h2>
        <p>Your booking has been successfully completed.</p>
        
        <div style="background-color: #f8f8f8; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <h3 style="margin-top: 0;">Booking Details</h3>
          <p><strong>Booking Number:</strong> ${bookingNumber}</p>
          <p><strong>Vehicle:</strong> ${carModel}</p>
          <p><strong>Rental Period:</strong> ${startDate} to ${endDate}</p>
          <p><strong>Total Amount:</strong> $${totalPrice.toFixed(2)}</p>
        </div>
        
        <p>We hope you enjoyed your experience with CarRent. Please consider leaving feedback about your rental experience.</p>
        
        <div style="margin-top: 30px; text-align: center;">
          <a href="https://yourcarrentapp.com/feedback?booking=${bookingNumber}" style="background-color: #4CAF50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            Leave Feedback
          </a>
        </div>
        
        <p style="margin-top: 30px;">Thank you for choosing CarRent for your mobility needs!</p>
        <p>The CarRent Team</p>
      </div>
    `
  };
  
  return await transporter.sendMail(mailOptions);
};

module.exports = {
  sendBookingCompletionEmail
};