# Node.js Application

This is a Node.js application built with Express.js. It includes MongoDB integration and follows best practices for API development.

## Features

- **Express.js**: Web framework for building RESTful APIs.
- **MongoDB**: Database integration for data storage.
- **Error Handling**: Centralized error handling middleware.
- **Environment Variables**: Managed using `dotenv`.

## Prerequisites

- [Node.js](https://nodejs.org/) (v16 or higher)
- [MongoDB](https://www.mongodb.com/)
- Docker (optional, for containerization)

## Installation

1. Clone the repository:

   ```bash
   git clone https://git.epam.com/Karthik_Lakshmanan/workaround.git
   cd workaround

2. Install dependencies:
     ```bash
    npm install

3. Create a .env file in the root directory and add the following variables:
    PORT=5000
    MONGO_URI=<your-mongodb-connection-string>

4. Start the application
    ```bash
    npm run dev


