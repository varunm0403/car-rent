import { Component } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from "./shared/components/navbar/navbar.component";
import { FooterComponent } from "./shared/components/footer/footer.component";
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,  // Add this line
  imports: [RouterOutlet, CommonModule, NavbarComponent, FooterComponent],  // Add CommonModule
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'car-rental';
  showHeader = true;
  constructor(private router: Router) {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.showHeader = !event.url.includes('/login') && !event.url.includes('/register');
    });
  }
}