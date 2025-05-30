import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import { connectToDatabase } from '../config/database';
import User from '../models/User';
import SupportAgentList from '../models/SupportAgentList';
import { USER_ROLES } from '../config/constants';
import { logger } from './logger';

// Load environment variables
dotenv.config();

/**
 * Seed admin user
 */
const seedAdminUser = async (): Promise<void> => {
  try {
    const adminEmail = 'admin@carental.com';
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (!existingAdmin) {
      logger.info('Creating admin user...');
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
      logger.info('Admin user created successfully');
    } else {
      logger.info('Admin user already exists');
    }
  } catch (error) {
    logger.error(`Error seeding admin user: ${error}`);
  }
};

/**
 * Seed support agent emails
 */
const seedSupportAgents = async (): Promise<void> => {
  try {
    logger.info('Seeding support agent emails...');
    
    // Default support agent emails
    const supportAgentEmails = [
      'support@carental.com',
      'agent1@carental.com',
      'agent2@carental.com',
      'agent3@carental.com'
    ];
    
    // Create support agent entries
    for (const email of supportAgentEmails) {
      const existingAgent = await SupportAgentList.findOne({ email: email.toLowerCase() });
      
      if (!existingAgent) {
        const supportAgent = new SupportAgentList({
          email: email.toLowerCase()
        });
        
        await supportAgent.save();
        logger.info(`Added support agent email: ${email}`);
      }
    }
    
    logger.info('Support agent emails seeded successfully');
  } catch (error) {
    logger.error(`Error seeding support agent emails: ${error}`);
  }
};

/**
 * Create support agent users
 */
const createSupportAgentUsers = async (): Promise<void> => {
  try {
    logger.info('Creating support agent users...');
    
    // Get all support agent emails
    const supportAgents = await SupportAgentList.find();
    
    // Default password for support agents
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('Support123', salt);
    
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
          role: USER_ROLES.SUPPORT_AGENT,
          imageUrl: 'https://application.s3.eu-central-1.amazonaws.com/img/users/support.png'
        });
        
        await supportUser.save();
        createdCount++;
      } else if (existingUser.role !== USER_ROLES.SUPPORT_AGENT) {
        // Update existing users to have the correct role
        existingUser.role = USER_ROLES.SUPPORT_AGENT;
        await existingUser.save();
        updatedCount++;
      }
    }
    
    if (createdCount > 0) {
      logger.info(`Created ${createdCount} support agent users successfully`);
    } else {
      logger.info('No new support agent users needed to be created');
    }
    
    if (updatedCount > 0) {
      logger.info(`Updated roles for ${updatedCount} existing support agent users`);
    }
  } catch (error) {
    logger.error(`Error creating support agent users: ${error}`);
  }
};

/**
 * Main seed function
 */
const seedDatabase = async (): Promise<void> => {
  try {
    logger.info('Starting database seeding...');
    
    // Connect to database
    await connectToDatabase();
    
    // Seed data
    await seedAdminUser();
    await seedSupportAgents();
    await createSupportAgentUsers();
    
    logger.info('Database seeding completed successfully');
    
    // Disconnect from database
    await mongoose.disconnect();
    logger.info('Disconnected from database');
    
    process.exit(0);
  } catch (error) {
    logger.error(`Error seeding database: ${error}`);
    process.exit(1);
  }
};

// Run the seed function
seedDatabase();