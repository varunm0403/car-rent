import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface CalendarDay {
  date: number;
  month: number;
  year: number;
  isCurrentMonth: boolean;
  isSelected?: boolean;
  isDisabled?: boolean;
  isInRange?: boolean;
}

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  @Input() initialPickupDate: Date = new Date();
  @Input() initialDropoffDate: Date = new Date();
  @Input() initialPickupTime: string = '07:00 AM';
  @Input() initialDropoffTime: string = '10:30 AM';
  
  @Output() dateRangeSelected = new EventEmitter<{
    start: Date;
    end: Date;
    pickupTime: string;
    dropoffTime: string;
  }>();
  
  @Output() closeCalendar = new EventEmitter<void>();
  
  currentMonth: Date = new Date();
  nextMonth: Date = new Date();
  daysOfWeek: string[] = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];
  
  currentMonthDays: CalendarDay[] = [];
  nextMonthDays: CalendarDay[] = [];
  
  pickupDate: Date | null = null;
  dropoffDate: Date | null = null;
  pickupTime: string = '07:00 AM';
  dropoffTime: string = '10:30 AM';
  
  selectionMode: 'pickup' | 'dropoff' = 'pickup';

  constructor() {
    this.nextMonth = new Date(this.currentMonth);
    this.nextMonth.setMonth(this.nextMonth.getMonth() + 1);
  }

  ngOnInit(): void {
    // Initialize with provided dates
    this.pickupDate = new Date(this.initialPickupDate);
    this.dropoffDate = new Date(this.initialDropoffDate);
    this.pickupTime = this.initialPickupTime;
    this.dropoffTime = this.initialDropoffTime;
    
    this.generateCalendarDays();
    this.updateSelectedStatus();
    this.setDisabledDates();
  }

  generateCalendarDays(): void {
    this.currentMonthDays = this.getCalendarDays(this.currentMonth);
    this.nextMonthDays = this.getCalendarDays(this.nextMonth);
  }

  getCalendarDays(monthDate: Date): CalendarDay[] {
    const year = monthDate.getFullYear();
    const month = monthDate.getMonth();
    
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);
    
    // Get the day of the week of the first day (0 = Sunday, 1 = Monday, etc.)
    let firstDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (firstDayOfWeek < 0) firstDayOfWeek = 6; // Convert Sunday from 0 to 7
    
    const daysInMonth = lastDayOfMonth.getDate();
    
    const days: CalendarDay[] = [];
    
    // Add days from previous month
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();
    
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      days.push({
        date: daysInPrevMonth - i,
        month: month - 1,
        year: month === 0 ? year - 1 : year,
        isCurrentMonth: false
      });
    }
    
    // Add days from current month
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: i,
        month: month,
        year: year,
        isCurrentMonth: true
      });
    }
    
    // Add days from next month
    const remainingDays = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: i,
        month: month + 1,
        year: month === 11 ? year + 1 : year,
        isCurrentMonth: false
      });
    }
    
    return days;
  }

  selectDate(date: number, month: number, year: number): void {
    const selectedDate = new Date(year, month, date);
    
    if (this.selectionMode === 'pickup') {
      this.pickupDate = selectedDate;
      // If pickup date is after dropoff date or no dropoff date is set,
      // set dropoff date to pickup date + 1 day
      if (!this.dropoffDate || selectedDate >= this.dropoffDate) {
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        this.dropoffDate = nextDay;
      }
      this.selectionMode = 'dropoff';
    } else {
      // Ensure dropoff date is not before pickup date
      if (this.pickupDate && selectedDate >= this.pickupDate) {
        this.dropoffDate = selectedDate;
        this.selectionMode = 'pickup';
        
        // Emit the selected date range
        this.emitDateRange();
      } else {
        // If user selects a date before pickup, treat it as a new pickup date
        this.pickupDate = selectedDate;
        // Set dropoff to pickup + 1 day
        const nextDay = new Date(selectedDate);
        nextDay.setDate(nextDay.getDate() + 1);
        this.dropoffDate = nextDay;
      }
    }
    
    this.updateSelectedStatus();
  }

  updateSelectedStatus(): void {
    // Reset all selections
    this.currentMonthDays.forEach(day => {
      day.isSelected = false;
      day.isInRange = false;
    });
    this.nextMonthDays.forEach(day => {
      day.isSelected = false;
      day.isInRange = false;
    });
    
    // Mark pickup date
    if (this.pickupDate) {
      this.markDate(this.pickupDate, true, false);
    }
    
    // Mark dropoff date
    if (this.dropoffDate) {
      this.markDate(this.dropoffDate, true, false);
    }
    
    // Mark dates in range
    if (this.pickupDate && this.dropoffDate) {
      const start = new Date(this.pickupDate);
      const end = new Date(this.dropoffDate);
      
      // Skip start and end dates (already marked as selected)
      start.setDate(start.getDate() + 1);
      
      while (start < end) {
        this.markDate(start, false, true);
        start.setDate(start.getDate() + 1);
      }
    }
  }

  markDate(date: Date, isSelected: boolean, isInRange: boolean): void {
    const markInCalendar = (days: CalendarDay[]) => {
      const day = days.find(d => 
        d.date === date.getDate() && 
        d.month === date.getMonth() && 
        d.year === date.getFullYear()
      );
      
      if (day) {
        if (isSelected) day.isSelected = true;
        if (isInRange) day.isInRange = true;
      }
    };
    
    markInCalendar(this.currentMonthDays);
    markInCalendar(this.nextMonthDays);
  }

  setDisabledDates(): void {
    // Disable past dates
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const disablePastDates = (days: CalendarDay[]) => {
      days.forEach(day => {
        const date = new Date(day.year, day.month, day.date);
        day.isDisabled = date < today;
      });
    };
    
    disablePastDates(this.currentMonthDays);
    disablePastDates(this.nextMonthDays);
    
    // You can add more specific disabled dates here
  }

  previousMonth(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() - 1);
    this.nextMonth.setMonth(this.nextMonth.getMonth() - 1);
    this.generateCalendarDays();
    this.updateSelectedStatus();
    this.setDisabledDates();
  }

  nextMonthNav(): void {
    this.currentMonth.setMonth(this.currentMonth.getMonth() + 1);
    this.nextMonth.setMonth(this.nextMonth.getMonth() + 1);
    this.generateCalendarDays();
    this.updateSelectedStatus();
    this.setDisabledDates();
  }

  getMonthName(date: Date): string {
    return date.toLocaleString('default', { month: 'long' }) + ' ' + date.getFullYear();
  }

  emitDateRange(): void {
    if (this.pickupDate && this.dropoffDate) {
      this.dateRangeSelected.emit({
        start: this.pickupDate,
        end: this.dropoffDate,
        pickupTime: this.pickupTime,
        dropoffTime: this.dropoffTime
      });
    }
  }
  
  applySelection(): void {
    this.emitDateRange();
    this.closeCalendar.emit();
  }
  
  cancel(): void {
    this.closeCalendar.emit();
  }
}