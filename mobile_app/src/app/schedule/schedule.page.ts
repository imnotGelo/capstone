import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.page.html',
  styleUrls: ['./schedule.page.scss'],
})
export class SchedulePage implements OnInit {
  user: any;
  isStudent: boolean = false;
  section: boolean = false;

  constructor(
    private router: Router,
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const userData = navigation.extras.state['user'];
      if (userData && userData.studentData && userData.sectionData) {
        this.user = userData;
        this.isStudent = true;
        this.section = true;
      } else {
        this.user = userData;
        this.isStudent = false;
        this.section = false;
      }
    }
  }

  ngOnInit() {}

  back() {
    this.router.navigate(['/landing']);
  }

  formatTime(time: string): string {
    const timeParts = time.split(':');
    const hours = parseInt(timeParts[0], 10);
    const minutes = timeParts[1];
    const period = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; 
    return `${formattedHours}:${minutes} ${period}`;
  }

  getSubjects(): { name: string, time_start: string, time_end: string }[] {
    const subjects = [];
    for (let i = 1; i <= 9; i++) {
      const subjectName = this.user.sectionData[`subject_${i}`];
      const timeStart = this.user.sectionData[`time_start_${i}`];
      const timeEnd = this.user.sectionData[`time_end_${i}`];
      if (subjectName && timeStart && timeEnd) {
        subjects.push({ name: subjectName, time_start: timeStart, time_end: timeEnd });
      }
    }
    return subjects;
  }

}
