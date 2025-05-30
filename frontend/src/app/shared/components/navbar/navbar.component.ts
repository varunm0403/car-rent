import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], // Remove Router from imports - it's not a module
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent implements OnInit {
  user: any = null;
  isLoggedIn = false;
  dropdownOpen = false;
  isMenuOpen = false;
  languageDropdownOpen = false;
  
  constructor(private router: Router) {}

  ngOnInit(): void {
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('currentUser');
      if (storedUser) {
        this.user = JSON.parse(storedUser);
        this.isLoggedIn = true;
        console.log('User loaded:', this.user);
      }
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.router.navigate(['/']);
    this.isLoggedIn = false;
    this.user = null;
    this.dropdownOpen = false;
  }

  goToProfile() {
    this.router.navigate(['/user-profile']);
    this.dropdownOpen = false;
  }
  
  selectedLanguage = 'En';

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
    this.dropdownOpen = false;
    this.languageDropdownOpen = false;
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    this.languageDropdownOpen = false;
  }

  toggleLanguageDropdown() {
    this.languageDropdownOpen = !this.languageDropdownOpen;
    this.dropdownOpen = false;
  }

  selectLanguage(lang: string) {
    this.selectedLanguage = lang;
    this.languageDropdownOpen = false;
  }

  isCarsActive(): boolean {
    return this.router.url.includes('/cars');
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent) {
    const target = event.target as HTMLElement;

    // Close dropdown if clicked outside profile dropdown
    if (!target.closest('.profile-dropdown')) {
      this.dropdownOpen = false;
    }

    // Close mobile menu if clicked outside of nav and menu toggle
    if (!target.closest('.mobile-menu') && !target.closest('.menu-toggle')) {
      this.isMenuOpen = false;
    }

    // Close language dropdown if clicked outside
    if (!target.closest('.relative')) {
      this.languageDropdownOpen = false;
    }
  }
}