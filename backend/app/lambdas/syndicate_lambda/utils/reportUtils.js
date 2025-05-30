/**
 * Report Utilities
 * Handles report generation and distribution
 */

const AWS = require('aws-sdk');
const ExcelJS = require('exceljs');
const nodemailer = require('nodemailer');
const { EMAIL_CONFIG } = require('../config/config');

// Initialize AWS S3
const s3 = new AWS.S3({
  region: process.env.AWS_REGION || 'us-east-1',
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
});

/**
 * Generate a report file and upload to S3
 * @param {Object} report - Report data
 * @param {string} format - File format (XLSX, CSV, PDF)
 * @returns {Promise<string>} URL of the generated file
 */
const generateReportFile = async (report, format = 'XLSX') => {
  try {
    let fileBuffer;
    let contentType;
    let fileExtension;
    
    // Generate file based on format
    switch (format) {
      case 'CSV':
        fileBuffer = await generateCSVBuffer(report);
        contentType = 'text/csv';
        fileExtension = 'csv';
        break;
      case 'PDF':
        // PDF generation would typically use a library like PDFKit
        // For simplicity, we'll default to XLSX if PDF is requested
        console.log('PDF generation not implemented, defaulting to XLSX');
        // falls through
      case 'XLSX':
      default:
        fileBuffer = await generateExcelBuffer(report);
        contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
        fileExtension = 'xlsx';
    }
    
    // Generate filename
    const dateStr = new Date().toISOString().replace(/[:.]/g, '-');
    const reportType = report.reportType || 'REPORT';
    const fileName = `reports/${reportType}_${dateStr}.${fileExtension}`;
    
    // Upload to S3
    const params = {
      Bucket: process.env.S3_BUCKET_NAME || 'car-rental-reports',
      Key: fileName,
      Body: fileBuffer,
      ContentType: contentType
    };
    
    const uploadResult = await s3.upload(params).promise();
    return uploadResult.Location;
  } catch (error) {
    console.error('Error generating report file:', error);
    throw error;
  }
};

/**
 * Generate Excel buffer from report data
 * @param {Object} report - Report data
 * @returns {Promise<Buffer>} Excel buffer
 */
const generateExcelBuffer = async (report) => {
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'CarRent System';
  workbook.lastModifiedBy = 'CarRent System';
  workbook.created = new Date();
  workbook.modified = new Date();
  
  // Add metadata sheet
  const metadataSheet = workbook.addWorksheet('Report Info');
  metadataSheet.columns = [
    { header: 'Property', key: 'property', width: 20 },
    { header: 'Value', key: 'value', width: 40 }
  ];
  
  metadataSheet.addRows([
    { property: 'Report Type', value: report.reportType },
    { property: 'Date From', value: new Date(report.dateFrom).toLocaleDateString() },
    { property: 'Date To', value: new Date(report.dateTo).toLocaleDateString() },
    { property: 'Generated On', value: new Date().toLocaleDateString() }
  ]);
  
  if (report.locationId) {
    metadataSheet.addRow({ property: 'Location ID', value: report.locationId });
  }
  
  if (report.carId) {
    metadataSheet.addRow({ property: 'Car ID', value: report.carId });
  }
  
  if (report.supportAgentId) {
    metadataSheet.addRow({ property: 'Support Agent ID', value: report.supportAgentId });
  }
  
  // Add data sheets based on report type
  if (report.reportType === 'SALES' && report.salesData) {
    // Add car statistics sheet
    const carsSheet = workbook.addWorksheet('Car Statistics');
    carsSheet.columns = [
      { header: 'Car Model', key: 'carModel', width: 30 },
      { header: 'Days Rented', key: 'daysRented', width: 15 },
      { header: 'Reservations', key: 'reservationsCount', width: 15 },
      { header: 'Mileage Start', key: 'mileageStart', width: 15 },
      { header: 'Mileage End', key: 'mileageEnd', width: 15 },
      { header: 'Total KM', key: 'totalKilometers', width: 15 },
      { header: 'Avg KM/Reservation', key: 'avgMileagePerReservation', width: 20 },
      { header: 'Avg KM Delta %', key: 'avgMileageDeltaPercent', width: 15 },
      { header: 'Avg Feedback', key: 'avgFeedback', width: 15 },
      { header: 'Min Feedback', key: 'minFeedback', width: 15 },
      { header: 'Feedback Delta %', key: 'avgFeedbackDeltaPercent', width: 15 },
      { header: 'Revenue', key: 'revenue', width: 15 },
      { header: 'Revenue Delta %', key: 'revenueDeltaPercent', width: 15 }
    ];
    
    // Add car data rows
    if (report.salesData.carsStatistics && report.salesData.carsStatistics.length > 0) {
      carsSheet.addRows(report.salesData.carsStatistics);
    }
    
    // Add location statistics sheet
    if (report.salesData.locationStatistics) {
      const locationSheet = workbook.addWorksheet('Location Statistics');
      locationSheet.columns = [
        { header: 'Property', key: 'property', width: 30 },
        { header: 'Value', key: 'value', width: 20 }
      ];
      
      const locStats = report.salesData.locationStatistics;
      locationSheet.addRows([
        { property: 'Total Reservations', value: locStats.totalReservations },
        { property: 'Total Revenue', value: locStats.totalRevenue },
        { property: 'Average Feedback', value: locStats.avgFeedback },
        { property: 'Reservation Completion Rate', value: `${locStats.reservationCompletionRate}%` }
      ]);
      
      // Add popular cars section
      locationSheet.addRow({ property: 'Popular Cars', value: '' });
      if (locStats.popularCars && locStats.popularCars.length > 0) {
        locStats.popularCars.forEach((car, index) => {
          locationSheet.addRow({ 
            property: `${index + 1}. ${car.carModel}`, 
            value: `${car.reservationsCount} reservations` 
          });
        });
      }
    }
  } else if (report.supportAgentData) {
    // Add support agent statistics sheet
    const agentsSheet = workbook.addWorksheet('Agent Performance');
    agentsSheet.columns = [
      { header: 'Agent Name', key: 'agentName', width: 30 },
      { header: 'Reservations Processed', key: 'reservationsProcessed', width: 25 },
      { header: 'Reservations Delta %', key: 'reservationsProcessedDeltaPercent', width: 20 },
      { header: 'Avg Feedback', key: 'avgFeedback', width: 15 },
      { header: 'Min Feedback', key: 'minFeedback', width: 15 },
      { header: 'Feedback Delta %', key: 'feedbackDeltaPercent', width: 15 },
      { header: 'Revenue', key: 'revenue', width: 15 },
      { header: 'Revenue Delta %', key: 'revenueDeltaPercent', width: 15 }
    ];
    
    // Add agent data rows
    if (report.supportAgentData.agentStatistics && report.supportAgentData.agentStatistics.length > 0) {
      agentsSheet.addRows(report.supportAgentData.agentStatistics);
    }
  }
  
  // Generate buffer
  return await workbook.xlsx.writeBuffer();
};

/**
 * Generate CSV buffer from report data
 * @param {Object} report - Report data
 * @returns {Promise<Buffer>} CSV buffer
 */
const generateCSVBuffer = async (report) => {
  let csvContent = '';
  
  // Add metadata
  csvContent += 'Report Type,Date From,Date To,Generated On\n';
  csvContent += `${report.reportType},${new Date(report.dateFrom).toLocaleDateString()},${new Date(report.dateTo).toLocaleDateString()},${new Date().toLocaleDateString()}\n\n`;
  
  if (report.reportType === 'SALES' && report.salesData) {
    // Add car statistics
    csvContent += 'CAR STATISTICS\n';
    csvContent += 'Car Model,Days Rented,Reservations,Mileage Start,Mileage End,Total KM,Avg KM/Reservation,Avg KM Delta %,Avg Feedback,Min Feedback,Feedback Delta %,Revenue,Revenue Delta %\n';
    
    if (report.salesData.carsStatistics && report.salesData.carsStatistics.length > 0) {
      report.salesData.carsStatistics.forEach(car => {
        csvContent += `"${car.carModel}",${car.daysRented},${car.reservationsCount},${car.mileageStart},${car.mileageEnd},${car.totalKilometers},${car.avgMileagePerReservation},${car.avgMileageDeltaPercent},${car.avgFeedback},${car.minFeedback},${car.avgFeedbackDeltaPercent},${car.revenue},${car.revenueDeltaPercent}\n`;
      });
    }
    
    // Add location statistics
    if (report.salesData.locationStatistics) {
      const locStats = report.salesData.locationStatistics;
      csvContent += '\nLOCATION STATISTICS\n';
      csvContent += `Total Reservations,${locStats.totalReservations}\n`;
      csvContent += `Total Revenue,${locStats.totalRevenue}\n`;
      csvContent += `Average Feedback,${locStats.avgFeedback}\n`;
      csvContent += `Reservation Completion Rate,${locStats.reservationCompletionRate}%\n`;
      
      // Add popular cars
      csvContent += '\nPOPULAR CARS\n';
      csvContent += 'Car Model,Reservations\n';
      if (locStats.popularCars && locStats.popularCars.length > 0) {
        locStats.popularCars.forEach(car => {
          csvContent += `"${car.carModel}",${car.reservationsCount}\n`;
        });
      }
    }
  } else if (report.supportAgentData) {
    // Add agent statistics
    csvContent += 'AGENT PERFORMANCE\n';
    csvContent += 'Agent Name,Reservations Processed,Reservations Delta %,Avg Feedback,Min Feedback,Feedback Delta %,Revenue,Revenue Delta %\n';
    
    if (report.supportAgentData.agentStatistics && report.supportAgentData.agentStatistics.length > 0) {
      report.supportAgentData.agentStatistics.forEach(agent => {
        csvContent += `"${agent.agentName}",${agent.reservationsProcessed},${agent.reservationsProcessedDeltaPercent},${agent.avgFeedback},${agent.minFeedback},${agent.feedbackDeltaPercent},${agent.revenue},${agent.revenueDeltaPercent}\n`;
      });
    }
  }
  
  return Buffer.from(csvContent, 'utf-8');
};

/**
 * Send report by email
 * @param {string} recipient - Email recipient
 * @param {string} subject - Email subject
 * @param {Object} report - Report data
 * @returns {Promise<Object>} Email send result
 */
const sendReportEmail = async (recipient, subject, report) => {
  try {
    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: EMAIL_CONFIG.host,
      port: EMAIL_CONFIG.port,
      secure: EMAIL_CONFIG.secure,
      auth: EMAIL_CONFIG.auth
    });
    
    // Generate email content
    let emailContent = `
      <h1>CarRent ${report.reportType} Report</h1>
      <p><strong>Period:</strong> ${new Date(report.dateFrom).toLocaleDateString()} to ${new Date(report.dateTo).toLocaleDateString()}</p>
      <p>Please find the requested report attached or download it from the link below:</p>
      <p><a href="${report.fileUrl}">Download Report</a></p>
      
      <h2>Report Summary</h2>
    `;
    
    // Add summary based on report type
    if (report.reportType === 'SALES' && report.salesData) {
      const locStats = report.salesData.locationStatistics;
      emailContent += `
        <p><strong>Total Reservations:</strong> ${locStats.totalReservations}</p>
        <p><strong>Total Revenue:</strong> $${locStats.totalRevenue.toFixed(2)}</p>
        <p><strong>Average Feedback:</strong> ${locStats.avgFeedback}</p>
        <p><strong>Reservation Completion Rate:</strong> ${locStats.reservationCompletionRate}%</p>
        
        <h3>Top Cars by Reservations</h3>
        <ul>
      `;
      
      if (locStats.popularCars && locStats.popularCars.length > 0) {
        locStats.popularCars.slice(0, 3).forEach(car => {
          emailContent += `<li>${car.carModel} - ${car.reservationsCount} reservations</li>`;
        });
      }
      
      emailContent += '</ul>';
    } else if (report.supportAgentData && report.supportAgentData.agentStatistics) {
      const agents = report.supportAgentData.agentStatistics;
      
      if (agents.length > 0) {
        emailContent += `
          <h3>Agent Performance Summary</h3>
          <table border="1" cellpadding="5" style="border-collapse: collapse;">
            <tr>
              <th>Agent</th>
              <th>Reservations</th>
              <th>Revenue</th>
              <th>Avg Feedback</th>
            </tr>
        `;
        
        agents.forEach(agent => {
          emailContent += `
            <tr>
              <td>${agent.agentName}</td>
              <td>${agent.reservationsProcessed}</td>
              <td>$${agent.revenue.toFixed(2)}</td>
              <td>${agent.avgFeedback}</td>
            </tr>
          `;
        });
        
        emailContent += '</table>';
      }
    }
    
    emailContent += `
      <p style="margin-top: 30px; font-size: 12px; color: #666;">
        This is an automated email from the CarRent reporting system. Please do not reply.
      </p>
    `;
    
    // Send email
    const info = await transporter.sendMail({
      from: `"CarRent Reports" <${EMAIL_CONFIG.auth.user}>`,
      to: recipient,
      subject: subject,
      html: emailContent,
      attachments: [
        {
          filename: report.fileName || `${report.reportType}_Report.${report.fileFormat.toLowerCase()}`,
          path: report.fileUrl
        }
      ]
    });
    
    return {
      messageId: info.messageId,
      success: true
    };
  } catch (error) {
    console.error('Error sending report email:', error);
    throw error;
  }
};

module.exports = {
  generateReportFile,
  sendReportEmail
};