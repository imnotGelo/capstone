import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { Router } from '@angular/router';

@Component({
  selector: 'app-archive',
  templateUrl: './archive.page.html',
  styleUrls: ['./archive.page.scss'],
})
export class ArchivePage implements OnInit {
  research: any[] = [];
  selectedCategory: string = ''; 
  sortByDate: 'MostRecent' | 'Oldest' = 'MostRecent';
  searchQuery: string = '';


  constructor(
    private apiService: ApiService,
    private inAppBrowser: InAppBrowser,
    private router: Router,
  ) {}

  ngOnInit() {
    this.getResearch();
  }

  back() {
    this.router.navigate(['/landing']);
  }

  getResearch() {
    this.apiService.thesis().subscribe(
      (res: any) => {
        this.research = res;
      },
      (error: any) => {
        alert('Try Again');
        console.log("ERROR ===", error);
      }
    );
  }

  toggleMinimized(item: any): void {
    item.minimized = !item.minimized;
  }

  viewPdf(fileUrl: string): void {
    const browser = this.inAppBrowser.create(fileUrl, '_blank');
  }

  truncate(title: string): string {
    const maxLength = 27;
    if (title.length > maxLength) {
      return title.substring(0, maxLength) + '...';
    } else {
      return title;
    }
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;
  }

  sortByMostRecent(): void {
    this.sortByDate = 'MostRecent';
  }

  sortByOldest(): void {
    this.sortByDate = 'Oldest';
  }

  get filteredResearch() {
    let filtered = this.selectedCategory
      ? this.research.filter(item => item.category === this.selectedCategory)
      : this.research;

    if (this.searchQuery.trim() !== '') {
      const lowerCaseQuery = this.searchQuery.toLowerCase();
      filtered = filtered.filter(item =>
        item.title.toLowerCase().includes(lowerCaseQuery) ||
        item.abstract.toLowerCase().includes(lowerCaseQuery)
      );
    }

    if (this.sortByDate === 'MostRecent') {
      filtered = filtered.sort((a, b) => b.year_publish.localeCompare(a.year_publish));
    } else if (this.sortByDate === 'Oldest') {
      filtered = filtered.sort((a, b) => a.year_publish.localeCompare(b.year_publish));
    }

    return filtered;
  }


}
