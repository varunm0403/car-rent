import { Component, OnInit, DoCheck } from '@angular/core';
import { RouterLink, Router, NavigationEnd } from '@angular/router';
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  standalone: true,
  imports: [RouterLink, CommonModule]
})
export class FooterComponent implements OnInit, DoCheck {
  currentYear = new Date().getFullYear();
  user: any = null;
  isLoggedIn = false;
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    this.checkUserState();
    
    // Subscribe to router events to update user state on navigation
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      this.checkUserState();
    });
  }
  
  // Also check on change detection cycles
  ngDoCheck(): void {
    this.checkUserState();
  }
  
  private checkUserState(): void {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        this.isLoggedIn = true;
      } else {
        this.user = null;
        this.isLoggedIn = false;
      }
    }
  }
  
  isCarsActive(): boolean {
    return this.router.url.includes('/cars');
  }
}