import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root',
})
export class ApiService {

  private baseUrl = environment.apiUrl;

   private hasNewNotificationSubject = new Subject<boolean>();
  hasNewNotification$ = this.hasNewNotificationSubject.asObservable();
 
 
  headers: HttpHeaders
    
  constructor(
    private http: HttpClient
    ) {
    this.headers = new HttpHeaders();
    this.headers.append("Accept", 'application/json');
    this.headers.append('Content-Type', 'application/json');
  }

  setNewNotificationState(hasNew: boolean) {
    this.hasNewNotificationSubject.next(hasNew);
  }

  signUp(NewData: any) {
    return this.http.post(`${this.baseUrl}/create.php`, NewData);
  }
  
  forgot(password: any) {
    return this.http.post(`${this.baseUrl}/forgot-pw.php`, password);
  }

  resetPW(password:any){
    return this.http.post(`${this.baseUrl}/reset-pw.php`, password);
  }

  verifyOtp(requestBody : any) {
    return this.http.post(`${this.baseUrl}/verifyOtp.php`, requestBody);
  } 

  resendOtp(email: string) {
    return this.http.post(`${this.baseUrl}/resendOtp.php`, { email: email });
}

  login(LRN:number, password: string){
    return this.http.post(`${this.baseUrl}/login.php`, { LRN, password });
  }

  getAnnouncements() {
    return this.http.get(`${this.baseUrl}/announcement.php`); 
  }

  addStudent(NewData: FormData) {
    return this.http.post(`${this.baseUrl}/createNew.php`, NewData);
  }

  addOldStudent(oldstudentData: FormData) {
    return this.http.post(`${this.baseUrl}/createOld.php`, oldstudentData);
  }

  checkLRN(LRN: string) {
    const requestData = { LRN: LRN };
    return this.http.post(`${this.baseUrl}/createOld.php`, requestData);
  }

  requested(data:any){
    return this.http.post(`${this.baseUrl}/request.php`, data);
  }

   getScheduleList() {
    return this.http.get(`${this.baseUrl}/calendar.php`); 
  }
  
  thesis() {
    return this.http.get(`${this.baseUrl}/research.php`); 
  }
  
  checkApplicationStatus(LRN:any){
    return this.http.post(`${this.baseUrl}/notif.php`, LRN); 
  }

}