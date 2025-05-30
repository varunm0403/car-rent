import { Component, OnInit } from '@angular/core';
import { FaqService, FaqItem } from '../../../core/auth/services/faq.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-faq-accordian',
  templateUrl: './faq-accordian.component.html',
  styleUrls: ['./faq-accordian.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class FaqAccordianComponent implements OnInit {
  faqItems: FaqItem[] = [];

  constructor(private faqService: FaqService) {}

  ngOnInit(): void {
    this.faqService.getFaqs().subscribe({
      next: (response) => {
        if (Array.isArray(response)) {
          this.faqItems = response.map((faq) => ({
            ...faq,
            isOpen: false // Initially closed
          }));
          if (this.faqItems.length > 0) {
            this.faqItems[0].isOpen = true; // Open the first item
          }
        }
      },
      error: (err) => {
        console.error('Failed to load FAQs', err);
      }
    });
  }

  trackByQuestion(index: number, item: FaqItem): string {
    return item.question;
  }

  toggleFaq(item: FaqItem): void {
    item.isOpen = !item.isOpen;
  }
}