import { Component } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { AboutusComponent } from "../../shared/components/aboutus/aboutus.component";
import { OurlocationsComponent } from "../../shared/components/ourlocations/ourlocations.component";
import { RecentFeedbackComponent } from "../../shared/components/recent-feedback/recent-feedback.component";
import { FaqAccordianComponent } from '../../shared/components/faq-accordian/faq-accordian.component';
import { CarRentalFormComponent } from '../../shared/components/car-rental-form/car-rental-form.component';
import { PopularCarsComponent } from "../../shared/components/popular-cars/popular-cars.component";

@Component({
  selector: 'app-home',
  standalone:true,
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  imports: [RouterOutlet, AboutusComponent, OurlocationsComponent, RecentFeedbackComponent, FaqAccordianComponent, CarRentalFormComponent, PopularCarsComponent]
})
export class HomeComponent {
  constructor(private router: Router) {}

  goToLogin() {
    // Navigates to the login page
    this.router.navigate(['/login']);
  }
}