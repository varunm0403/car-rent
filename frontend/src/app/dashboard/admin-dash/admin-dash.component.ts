import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CalendarComponent } from '../../shared/components/calendar/calendar.component';

interface ReportData {
  periodStart: string;
  periodEnd: string;
  location: string;
  carModel: string;
  carId: string;
  daysOfRent: number;
  reservations: number;
  mileageAtBeginning: number;
  mileageAtEnd: number;
  totalMileage: number;
  averageMileage: number;
  deltaOfAverageMileage: string;
  averageFeedback: number;
  minimumFeedback: number;
  deltaOfAverageFeedback: string;
  revenue: number;
  deltaOfRevenue: string;
}

@Component({
  selector: 'app-admin-dash',
  standalone: true,
  imports: [CommonModule, FormsModule, CalendarComponent],
  templateUrl: './admin-dash.component.html',
  styleUrls: ['./admin-dash.component.css']
})
export class AdminDashComponent implements OnInit {
  // Report types dropdown data
  reportTypes: string[] = ['Sales report', 'Rental report', 'Revenue report', 'Feedback report'];
  selectedReportType: string = 'Sales report';

  // Location dropdown data
  locations: string[] = ['All Locations', 'Rome', 'Milan', 'Florence', 'Venice'];
  selectedLocation: string = 'Rome';

  // Date range selection
  startDate: Date | null = null;
  endDate: Date | null = null;
  displayDateRange: string = 'Nov 01 - Dec 30, 2024';
  showCalendar: boolean = false;
  
  // Report data and display
  reportData: ReportData[] = [];
  showReport: boolean = false;
  isDownloadMenuOpen: boolean = false;

  constructor() {}

  ngOnInit(): void {
    // Initialize with default values
    this.startDate = new Date(2024, 10, 1); // Nov 1, 2024
    this.endDate = new Date(2024, 11, 30);  // Dec 30, 2024
    
    // Generate mock data but don't show it yet
    this.generateMockData();
  }

  // Helper methods for templates
  getInitialPickupDate(): Date {
    return this.startDate || new Date();
  }

  getInitialDropoffDate(): Date {
    return this.endDate || new Date();
  }

  toggleCalendar(): void {
    this.showCalendar = !this.showCalendar;
  }

  onDateRangeSelected(event: {start: Date, end: Date, pickupTime: string, dropoffTime: string}): void {
    this.startDate = event.start;
    this.endDate = event.end;
    
    // Format the date range for display
    this.displayDateRange = this.formatDateRange(event.start, event.end);
    
    // If report is already showing, update the data
    if (this.showReport) {
      this.generateMockData();
    }
  }

  formatDateRange(start: Date, end: Date): string {
    const formatDate = (date: Date): string => {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
      });
    };
    
    return `${formatDate(start)} - ${formatDate(end)}, ${start.getFullYear()}`;
  }

  closeCalendarPopup(): void {
    this.showCalendar = false;
  }

  createReport(): void {
    // Generate new data and show the report
    this.generateMockData();
    this.showReport = true;
  }
  
  toggleDownloadMenu(): void {
    this.isDownloadMenuOpen = !this.isDownloadMenuOpen;
  }
  
  downloadReport(format: string): void {
    console.log(`Downloading report as ${format}`);
    // In a real app, this would trigger the actual download
    this.isDownloadMenuOpen = false;
  }

  generateMockData(): void {
    // Mock car models and IDs
    const carModels = [
      { model: 'Fiat Ageia', id: 'KE-56842' },
      { model: 'Nissan Juke', id: 'BC-04653' },
      { model: 'Toyota Prius', id: 'TL48F34987' },
      { model: 'Ford Focus', id: 'FR-78521' },
      { model: 'Volkswagen Golf', id: 'VW-12345' }
    ];
    
    // Format dates for display
    const formatDate = (date: Date): string => {
      return date.toLocaleDateString('en-GB', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.');
    };
    
    const startDateFormatted = formatDate(this.startDate || new Date());
    const endDateFormatted = formatDate(this.endDate || new Date());
    
    // Generate 3-5 random entries
    const numberOfEntries = Math.floor(Math.random() * 3) + 3;
    this.reportData = [];
    
    for (let i = 0; i < numberOfEntries; i++) {
      const randomCar = carModels[Math.floor(Math.random() * carModels.length)];
      const daysOfRent = Math.floor(Math.random() * 7) + 1;
      const reservations = Math.floor(Math.random() * 5) + 1;
      const mileageStart = Math.floor(Math.random() * 3000) + 1000;
      const mileageEnd = mileageStart + Math.floor(Math.random() * 2000) + 500;
      const totalMileage = mileageEnd - mileageStart;
      const avgMileage = Math.floor(totalMileage / reservations);
      
      // Generate random delta values (positive or negative)
      const deltaAvgMileage = Math.floor(Math.random() * 30) - 15;
      const avgFeedback = (Math.random() * 1.5) + 3.5; // Between 3.5 and 5
      const minFeedback = Math.max(3, avgFeedback - (Math.random() * 1));
      const deltaFeedback = Math.floor(Math.random() * 20) - 5;
      const revenue = reservations * daysOfRent * 150; // Simple revenue calculation
      const deltaRevenue = Math.floor(Math.random() * 20) - 5;
      
      this.reportData.push({
        periodStart: startDateFormatted,
        periodEnd: endDateFormatted,
        location: this.selectedLocation,
        carModel: randomCar.model,
        carId: randomCar.id,
        daysOfRent: daysOfRent,
        reservations: reservations,
        mileageAtBeginning: mileageStart,
        mileageAtEnd: mileageEnd,
        totalMileage: totalMileage,
        averageMileage: avgMileage,
        deltaOfAverageMileage: `${deltaAvgMileage > 0 ? '+' : ''}${deltaAvgMileage}%`,
        averageFeedback: parseFloat(avgFeedback.toFixed(1)),
        minimumFeedback: parseFloat(minFeedback.toFixed(1)),
        deltaOfAverageFeedback: `${deltaFeedback > 0 ? '+' : ''}${deltaFeedback}%`,
        revenue: revenue,
        deltaOfRevenue: `${deltaRevenue > 0 ? '+' : ''}${deltaRevenue}%`
      });
    }
    
    // Sort data by car model
    this.reportData.sort((a, b) => a.carModel.localeCompare(b.carModel));
  }
}