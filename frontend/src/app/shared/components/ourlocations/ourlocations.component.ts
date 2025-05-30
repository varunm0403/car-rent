import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { SafePipe } from '../../pipes/safe.pipe';

interface Location {
  id: string;
  name: string;
  address: string;
  imageUrl: string;
  lat: number;
  lng: number;
}

interface LocationResponse {
  success: boolean;
  message: string;
  data: {
    content: Location[];
  };
}

@Component({
  selector: 'app-ourlocations',
  standalone: true,
  imports: [CommonModule, SafePipe],
  templateUrl: './ourlocations.component.html',
  styleUrls: ['./ourlocations.component.css']
})
export class OurlocationsComponent implements OnInit {
  locations: Location[] = [];
  selectedIndex = 0;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<LocationResponse>('http://localhost:3002/api/v1/locations').subscribe(response => {
      this.locations = response.data.content;
    });
  }

  selectLocation(index: number) {
    this.selectedIndex = index;
  }

  get mapUrl(): string {
    const loc = this.locations[this.selectedIndex];
    return loc
      ? `https://maps.google.com/maps?q=${loc.lat},${loc.lng}&z=15&output=embed`
      : '';
  }
}