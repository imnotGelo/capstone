import { Component, OnInit } from '@angular/core';
import { ApiService } from '../api.service';
import { HttpClient } from '@angular/common/http';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';


@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.page.html',
  styleUrls: ['./calendar.page.scss'],
  providers: [DatePipe]
})
export class CalendarPage implements OnInit {

  highlightedDates: any[] = [];
  event: any[] = [] ;
  selectedMonth: any = new Date(); 

  constructor(private apiService: ApiService, 
    private http: HttpClient, 
    private datePipe: DatePipe,
    private router: Router) {}

  ngOnInit() {
    this.fetchScheduleData();
    this.events();
  }

  back(){
    this.router.navigate(['/landing'])
  }

  isWeekday = (dateString: string) => {
    const date = new Date(dateString);
    const utcDay = date.getUTCDay();
    return utcDay !== 0 && utcDay !== 6;
  };
  getCardStyle(item: any) {
    const highlightedDate = this.highlightedDates.find(date => date.date === item.start_datetime.substring(0, 10));
    if (highlightedDate) {
      return {
        'background-color': highlightedDate.backgroundColor,
        'color': highlightedDate.textColor
      };
    } else {
      return {}; // Return an empty object if no match found
    }
  } 
  

  fetchScheduleData() {
    this.http.get<any[]>('http://192.168.1.107/CAPSTONE/backend/calendar.php')
      .subscribe(data => {
        const backgroundColors = ['#E4DCCF', '#6D8B74', '#C2DED1', '#DBC4F0', '#BCCEF8', '#C7C8CC', '#92C7CF', '#FBF9F1', '#D2E0FB', '#C4D7B2', '#E3F4F4', '#D2E9E9']; // Add more colors as needed

        this.highlightedDates = data.reduce((acc, item, index) => {
          const startDate = new Date(item.start_datetime);
          const endDate = new Date(item.end_datetime);

          const dateRange = this.getDates(startDate, endDate,);

          const highlightedDates = dateRange.map(date => {
            return {
              date: date.toISOString().substring(0, 10),
              textColor: '#073965',
              backgroundColor: backgroundColors[index % backgroundColors.length],
              title: item.title, 
              description: item.description 
            };
          });
          return [...acc, ...highlightedDates];
        }, []);
      });
  }

  events() {
    this.apiService.getScheduleList().subscribe(
      (res: any) => {
        this.event = res as any[];
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

  filterEvents() {
    return this.event
      .filter(item => {
        const eventDate = new Date(item.start_datetime);
        return eventDate.getMonth() === this.selectedMonth.getMonth() && eventDate.getFullYear() === this.selectedMonth.getFullYear();
      })
      .sort((a, b) => {
        const startDateA = new Date(a.start_datetime);
        const startDateB = new Date(b.end_datetime);
        return startDateA.getTime() - startDateB.getTime();
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
  

}
