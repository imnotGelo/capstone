import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
 
  constructor(
    private http: HttpClient, 
    private router: Router,
    private route: ActivatedRoute,
    private apiService: ApiService
  ) { }

  otp: string[] = Array(6).fill(''); 
  timerVisible: boolean = true;
  timerExpired: boolean = false;
  minutes: number = 0;
  seconds: number = 0;
  timer: any;
  email: string = '';

  ngOnInit(): void {
    this.startTimer();
  }

  onInputChange(index: number, event: any): void {
    const value = event.target.value;
    
    if (event.inputType === 'delete') {
      this.otp[index - 0] = '';
    } else if (value.length === 1 && /^\d+$/.test(value)) {
      this.otp[index - 0] = value;
      
      if (index < 6) {
        const nextInput = document.querySelector(`input:nth-child(${index + 1})`) as HTMLInputElement;
        if (nextInput) {
          nextInput.focus();
        }
      }
    } else if (value.length === 0) {
      this.otp[index - 0] = '';
  
      if (index > 0) {
        const prevInput = document.querySelector(`input:nth-child(${index - 1})`) as HTMLInputElement;
        if (prevInput) {
          prevInput.focus();
        }
      }
    } else {
      this.otp[index - 0] = '';
    } 
  }

  verifyOTP(): void {
    const otp = this.otp.join('');
    const requestBody = {
      otp: otp,
    };
  
    this.apiService.verifyOtp(requestBody).subscribe(
      (res: any) => {
        if (res.status === 'Success') {
          console.log('OTP verification successful');
          alert('You have successfully created an account. You may now sign in and enroll.');
          this.router.navigate(['./login']);
        } else {
          console.log('OTP verification failed:', res.error);
          alert('The code you entered is incorrect. Please try again.');
        }
      },
      (err) => {
        console.error('Error verifying OTP:', err);
      }
    );
  }

  startTimer(): void {
    const timerLimit = 3 * 5;
    let timer = timerLimit;
    this.timer = setInterval(() => {
      this.minutes = Math.floor(timer / 60);
      this.seconds = timer % 60;
      if (timer <= 0) {
        clearInterval(this.timer);
        this.timerVisible = false;
        this.timerExpired = true;
      } else {
        timer--;
      }
    }, 1000);
  }

}
