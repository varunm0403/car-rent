/**
 * Database Initialization Script
 * Runs when the Lambda starts to ensure required data exists
 */

const { connectToDatabase } = require('./config/database');
const { seedSupportAgents } = require('./utils/adminUtils');
const User = require('./models/user');
const bcrypt = require('bcryptjs');
const { USER_ROLES } = require('./config/config');

/**
 * Initialize database with required data
 */
const initDatabase = async () => {
  try {
    console.log('Initializing database...');
    
    // Connect to database
    await connectToDatabase();
    
    // Seed support agent emails
    console.log('Seeding support agent emails...');
    const supportAgentResult = await seedSupportAgents();
    console.log(supportAgentResult.message);
    
    // Create admin user if it doesn't exist
    console.log('Checking for admin user...');
    const adminEmail = 'admin@carental.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      console.log('Creating admin user...');
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('Admin123', salt);
      
      const adminUser = new User({
        email: adminEmail,
        password: hashedPassword,
        firstName: 'System',
        lastName: 'Admin',
        role: USER_ROLES.ADMIN,
        imageUrl: 'https://application.s3.eu-central-1.amazonaws.com/img/users/admin.png'
      });
      
      await adminUser.save();
      console.log('Admin user created successfully');
    } else {
      console.log('Admin user already exists');
    }
    
    // Create support agent users if they don't exist
    console.log('Checking for support agent users...');
    
    // Get all support agent emails from the list
    const { getSupportAgentEmails } = require('./utils/adminUtils');
    const supportAgents = await getSupportAgentEmails();
    
    // Default password for support agents
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Support123', salt);
    
    // Create users for each support agent email
    let createdCount = 0;
    let updatedCount = 0;
    
    for (const agent of supportAgents) {
      const existingUser = await User.findOne({ email: agent.email });
      
      if (!existingUser) {
        // Extract name from email (before @)
        const emailName = agent.email.split('@')[0];
        const firstName = emailName.charAt(0).toUpperCase() + emailName.slice(1);
        
        const supportUser = new User({
          email: agent.email,
          password: hashedPassword,
          firstName: firstName,
          lastName: 'Support',
          role: "Support", // Use "Support" role directly
          imageUrl: 'https://application.s3.eu-central-1.amazonaws.com/img/users/support.png'
        });
        
        await supportUser.save();
        createdCount++;
      } else if (existingUser.role !== "Support") {
        // Update existing users to have the correct role
        existingUser.role = "Support";
        await existingUser.save();
        updatedCount++;
      }
    }
    
    if (createdCount > 0) {
      console.log(`Created ${createdCount} support agent users successfully`);
    } else {
      console.log('No new support agent users needed to be created');
    }
    
    if (updatedCount > 0) {
      console.log(`Updated roles for ${updatedCount} existing support agent users`);
    }
    
    console.log('Database initialization complete');
    return true;
  } catch (error) {
    console.error('Error initializing database:', error);
    return false;
  }
};

module.exports = initDatabase;