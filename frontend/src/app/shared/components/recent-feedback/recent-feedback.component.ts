import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  AfterViewInit,
  ChangeDetectorRef
} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FeedbackService } from '../../../core/auth/services/feedback.service';
 
interface FeedbackInfo{
  author:string,
  carImage:string,
  carModel:string,
  date:string,
  feedbackId:string,
  feedbackText:string,
  orderHistory:string,
  rating:number,
}
 
interface FeedbackInfoResponse{
  content:FeedbackInfo[];
  count : number;
}
 
@Component({
  selector: 'app-recent-feedback',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './recent-feedback.component.html',
  styleUrls: ['./recent-feedback.component.css']
})
export class RecentFeedbackComponent implements OnInit, AfterViewInit {
  scrollAmount = 400;
 
  @ViewChild('scrollContainer', { static: false }) scrollContainer!: ElementRef;
 
  canScrollLeft = false;
  canScrollRight = true;
 
  constructor(private http: HttpClient, private cdr: ChangeDetectorRef,private feedbackService: FeedbackService) {}
 
  isLoading = true;
  error:string|null = null;
  feedbacks:FeedbackInfo[]=[];
 
  ngOnInit(): void {
    this.loadFeedbacks();
  }
 
  loadFeedbacks(): void {
    this.isLoading = true;
    this.error = null;
 
    this.feedbackService.getFeedbackInfo().subscribe({
      next: (response: FeedbackInfoResponse) => {
        if (response && response.content) {
          this.feedbacks = response.content;
          this.isLoading = false;
 
          // Check scroll buttons after data is loaded
          setTimeout(() => {
            this.updateScrollButtons();
          }, 100);
        } else {
          console.error('Invalid response format');
          this.error = 'Failed to load feedback data. Please try again later.';
          this.isLoading = false;
        }
      },
      error: (err) => {
        console.error('Error fetching feedback data:', err);
        this.error = 'Failed to load feedback data. Please try again later.';
        this.isLoading = false;
      }
    });
  }
 
  ngAfterViewInit() {
    // Delay until DOM is ready
    setTimeout(() => {
      this.updateScrollButtons();
      this.cdr.detectChanges(); // ✅ Fix the ExpressionChangedAfterItHasBeenCheckedError
    });
  }
 
  scrollLeft(): void {
    this.scrollContainer.nativeElement.scrollBy({
      left: -this.scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(() => this.updateScrollButtons(), 300);
  }
 
  scrollRight(): void {
    this.scrollContainer.nativeElement.scrollBy({
      left: this.scrollAmount,
      behavior: 'smooth'
    });
    setTimeout(() => this.updateScrollButtons(), 300);
  }
 
  updateScrollButtons(): void {
    const el = this.scrollContainer.nativeElement;
    this.canScrollLeft = el.scrollLeft > 0;
    this.canScrollRight = el.scrollLeft + el.clientWidth < el.scrollWidth - 1;
  }
}