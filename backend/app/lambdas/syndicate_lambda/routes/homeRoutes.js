const homeController = require('../controllers/homeController');
const faqController = require('../controllers/faqController');

const handleRequest = async (path, method, event) => {
  console.log(`Home route: ${method} ${path}`);

  // Get homepage data
  if (path === '/home' && method === 'GET') {
    return await homeController.getHomeData(event);
  }

  // Search cars
  if (path === '/home/search' && method === 'GET') {
    return await homeController.searchCars(event);
  }

  // Get FAQ stories
  if (path === '/home/faq' && method === 'GET') {
    return await faqController.getAllFAQs();
  }

  // If no route matches
  return {
    statusCode: 404,
    body: {
      message: 'Home endpoint not found',
      path,
      method
    }
  };
};

module.exports = {
  handleRequest
};