// src/app/shared/components/documents/documents.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ProfileSidebarComponent } from '../profile-sidebar/profile-sidebar.component';

interface Document {
  id: string;
  name: string;
  size: string;
  type: 'passport' | 'license';
  file?: File;
}

@Component({
  selector: 'app-documents',
  standalone: true,
  imports: [CommonModule, RouterModule, ProfileSidebarComponent],
  templateUrl: './user-documents.component.html',
  styleUrl: './user-documents.component.css'
})
export class DocumentsComponent {
  passportDocuments: Document[] = [
    { id: 'passport-front', name: 'ID Card front side.pdf', size: '320 KB', type: 'passport' },
    { id: 'passport-back', name: 'ID Card back side.pdf', size: '310 KB', type: 'passport' }
  ];

  licenseDocuments: Document[] = [
    { id: 'license-front', name: 'License front side.pdf', size: '330 KB', type: 'license' },
    { id: 'license-back', name: 'License back side.pdf', size: '325 KB', type: 'license' }
  ];

  onFileSelected(event: Event, docType: 'passport' | 'license', docId: string): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      
      // Find the document to update
      const documents = docType === 'passport' ? this.passportDocuments : this.licenseDocuments;
      const docIndex = documents.findIndex(doc => doc.id === docId);
      
      if (docIndex !== -1) {
        // Update document with file info
        documents[docIndex] = {
          ...documents[docIndex],
          name: file.name,
          size: this.formatFileSize(file.size),
          file: file
        };
      }
    }
  }

  removeDocument(docType: 'passport' | 'license', docId: string): void {
    const documents = docType === 'passport' ? this.passportDocuments : this.licenseDocuments;
    const docIndex = documents.findIndex(doc => doc.id === docId);
    
    if (docIndex !== -1) {
      // Reset document to empty state
      documents[docIndex] = {
        ...documents[docIndex],
        name: '',
        size: '',
        file: undefined
      };
    }
  }

  saveChanges(): void {
    // Here you would typically upload the files to your backend
    console.log('Saving documents:', {
      passportDocuments: this.passportDocuments,
      licenseDocuments: this.licenseDocuments
    });
    
    alert('Documents saved successfully!');
  }

  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    else if (bytes < 1048576) return Math.round(bytes / 1024) + ' KB';
    else return Math.round(bytes / 1048576) + ' MB';
  }

  // Helper method to check if document has a file
  hasFile(doc: Document): boolean {
    return !!doc.name && !!doc.size;
  }
}