import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, NavigationExtras } from '@angular/router';
import { ApiService } from '../api.service';
import { NavController } from '@ionic/angular';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-landing',
  templateUrl: './landing.page.html',
  styleUrls: ['./landing.page.scss'],
})
export class LandingPage implements OnInit {

  user: any;
  avatarUrl: any;
  @ViewChild('fileInput') fileInput!: ElementRef;
  post_code: any;
  items: any[] = [];
  event: any[] = [] ;
  isStudent: boolean = false;
  isEnrollDisabled: boolean = false;
  hasNewNotification: boolean = false;
  
  constructor(private router: Router,
    private apiService: ApiService,
    private navCtrl: NavController,
    private datePipe: DatePipe) {
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state) {
          const userData = navigation.extras.state['user'];
          if (userData && userData.studentData) {
              const userDataWithStudentData = { ...userData, ...userData.studentData };
              this.user = userDataWithStudentData;
              this.isEnrollDisabled = true;
              this.isStudent = true; 
          } else {
              this.user = userData;
              this.isStudent = false; 
          }
      }
  }

  ngOnInit(): void {
    this.getAnnouncements();
    this.events();
    this.status();
  }

  logout(){
    this.router.navigate(['/login'])
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      this.avatarUrl = reader.result;
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  }

  uploadAvatar() {
    this.fileInput.nativeElement.click();
  }

  formatDate(date: string | null): string {
    if (date) {
      const formattedDate = new Date(date);
      return this.datePipe.transform(formattedDate, 'MMMM d, y') || '';
    } else {
      return ''; 
    }
  }
  

  getAnnouncements() {
    this.apiService.getAnnouncements().subscribe(
      (res: any) => {
        const previousItemCount = this.items ? this.items.length : 0;
        this.items = res;
          if (this.items.length > previousItemCount) {
          this.hasNewNotification = true;
        }
      },
      (error: any) => {
        alert('Failed to retrieve announcements. Please try again.');
        console.log('ERROR ===', error);
      }
    );
  }
  
  events() {
    this.apiService.getScheduleList().subscribe(
      (res: any) => {
        const previousEventCount = this.event ? this.event.length : 0;
        this.event = res.sort((a: { start_datetime: string | number | Date; }, b: { start_datetime: string | number | Date; }) => new Date(a.start_datetime).getTime() - new Date(b.start_datetime).getTime());
  
        if (this.event.length > previousEventCount) {
          this.hasNewNotification = true;
        }
      },
      (error: any) => {
        alert('Failed to retrieve events. Please try again.');
        console.log('ERROR ===', error);
      }
    );
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
      },
      (error) => {
        console.error('Error fetching application status:', error);
      }
    );
  }


  toggleMinimized(item: any): void {
    item.minimized = !item.minimized;
  }

  enroll() {
    this.navCtrl.navigateForward('/enroll', { state: { user: this.user } });
  }
  request() {
    this.navCtrl.navigateForward('/request', { state: { user: this.user } });
  }
  archive() {
    this.router.navigate(['/archive']);
  }
  grade() {
    this.navCtrl.navigateForward('/grades', { state: { user: this.user } });
  }
  calendar() {
    this.router.navigate(['/calendar']);
  }
  notification() {
    this.navCtrl.navigateForward('/notification', { state: { user: this.user } });
    this.hasNewNotification = false;
  }
  schedule() {
    this.navCtrl.navigateForward('/schedule', { state: { user: this.user } });
  }

  otp() {
    this.navCtrl.navigateForward('/otp', { state: { user: this.user } });
  }


}
