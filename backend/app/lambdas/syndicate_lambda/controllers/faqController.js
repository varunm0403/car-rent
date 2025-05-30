// faqController.js (Controller for FAQ)
const FAQ = require('../models/faq'); // Import the FAQ model

/**
 * Get all FAQs
 * @returns {Promise<Object>} Response object with all FAQs
 */
const getAllFAQs = async () => {
  try {
    const faqs = await FAQ.find(); // Get all FAQs from the database
    const formattedFaqs = faqs.map(faq => ({
      question: faq.question,
      answer: faq.answer
    }));
    
    return {
      statusCode: 200,
      body: {
        content: formattedFaqs
      }
    };
  } catch (error) {
    console.error('Error fetching FAQs:', error);
    return {
      statusCode: 500,
      body: {
        message: 'Failed to fetch FAQs'
      }
    };
  }
};

module.exports = {
  getAllFAQs
};