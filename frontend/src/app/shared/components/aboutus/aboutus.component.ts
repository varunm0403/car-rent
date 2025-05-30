import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AboutUsService, AboutUsInfo } from '../../../core/auth/services/about_us.service';

@Component({
  selector: 'app-aboutus',
  templateUrl: './aboutus.component.html',
  styleUrls: ['./aboutus.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AboutusComponent implements OnInit {
  aboutUsInfo: AboutUsInfo[] = [];

  constructor(private aboutUsService: AboutUsService) { }

  ngOnInit(): void {
    this.getAboutUsInfo();
  }

  getAboutUsInfo(): void {
    this.aboutUsService.getAboutUsInfo().subscribe(
      info => this.aboutUsInfo = info,
      error => console.error('Error fetching about us info:', error)
    );
  }

  getInfoByTitle(title: string): AboutUsInfo | undefined {
    return this.aboutUsInfo.find(info => info.title === title);
  }
}