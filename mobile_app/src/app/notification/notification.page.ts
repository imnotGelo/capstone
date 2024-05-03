import { Component, OnInit } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-notification',
  templateUrl: './notification.page.html',
  styleUrls: ['./notification.page.scss'],
})
export class NotificationPage implements OnInit {
  user: any;
  items: any[] = [];
  event: any[] = [] ;
  selectedMonth: any = new Date();
  hasNewNotification: boolean = false;


  constructor(private router: Router,
    private apiService: ApiService) { 
      const navigation = this.router.getCurrentNavigation();
      if (navigation && navigation.extras && navigation.extras.state) {
        this.user = navigation.extras.state['user'];
      } 
    }

  ngOnInit() {
    this.getAnnouncements();
    this.events();
    this.status();
    }

    back(){
      this.router.navigate(['/landing'])
    }
  
  toggleMinimized(item: any): void {
    item.minimized = !item.minimized;
  }

  getAnnouncements() {
    this.apiService.getAnnouncements().subscribe(
      (res: any) => {
        // Sort announcements by post_date in ascending order
        this.items = res.sort((a: { post_date: string | number | Date; }, b: { post_date: string | number | Date; }) => new Date(a.post_date).getTime() - new Date(b.post_date).getTime());
        this.hasNewNotification = true;
      },
      (error: any) => {
        alert('Try Again');
        console.log('ERROR ===', error);
      }
    );
  }

  filterAnnouncements() {
    return this.items.filter((item) => {
      const eventDate = new Date(item.post_date);
      return (
        eventDate.getMonth() === this.selectedMonth.getMonth() &&
        eventDate.getFullYear() === this.selectedMonth.getFullYear()
      );
    });
  }

  events() {
    this.apiService.getScheduleList().subscribe(
      (res: any) => {
        // Sort events by start_datetime in ascending order
        this.event = res.sort((a: { start_datetime: string | number | Date; }, b: { start_datetime: string | number | Date; }) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
        this.hasNewNotification = true;
      },
      (error: any) => {
        alert('Try Again');
        console.log('ERROR ===', error);
      }
    );
  }

  filterEvents() {
    return this.event.filter((item) => {
      const eventDate = new Date(item.start_datetime);
      return (
        eventDate.getMonth() === this.selectedMonth.getMonth() &&
        eventDate.getFullYear() === this.selectedMonth.getFullYear()
      );
    });
  }

  updateSelectedMonth(event: any) {
    const selectedDate = new Date(event.detail.value);
    this.selectedMonth = selectedDate;
  }

  getDates(startDate: Date, endDate: Date) {
    const dates = [];
    let currentDate = startDate;
    while (currentDate <= endDate) {
      dates.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }
    return dates;
  }

  status(){
    if (!this.user || !this.user.LRN) {
      console.error('LRN not available');
      return;
    }

    const LRN = {
      LRN : this.user.LRN,
    }
    this.apiService.checkApplicationStatus(LRN).subscribe(
      (res: any) => {
        this.user.applicationStatus = res.message;
        this.hasNewNotification = true;
      },
      (error) => {
        console.error('Error fetching application status:', error);
      }
    );
  }

  toggleApplicationStatusMinimized(): void {
    this.user.applicationStatusMinimized = !this.user.applicationStatusMinimized;
  }

}
