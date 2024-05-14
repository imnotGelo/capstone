import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.page.html',
  styleUrls: ['./otp.page.scss'],
})
export class OtpPage implements OnInit {
 
  constructor(private router: Router,
    private apiService: ApiService,
    private alertController: AlertController) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.user = navigation.extras.state['user'];
    } 
   }

  otp: string[] = Array(6).fill(''); 
  timerVisible: boolean = true;
  timerExpired: boolean = false;
  minutes: number = 0;
  seconds: number = 0;
  timer: any;
  user:any;
  lrn:any;
  email:string='';

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

  resendOTP(): void {
    this.apiService.resendOtp({ email: this.user.email }).subscribe(
      async (res: any) => {
        if (res.status === 'Success') {
          this.resetTimer();
          const alert = await this.alertController.create({
            header: 'OTP Resent',
            message: 'A new OTP has been sent to your email.',
            buttons: ['OK']
          });
          await alert.present();
        } else {
          const alert = await this.alertController.create({
            header: 'Error',
            message: 'Failed to resend OTP. Please try again later.',
            buttons: ['OK']
          });
          await alert.present();
        }
      },
      async (err) => {
        const alert = await this.alertController.create({
          header: 'Error',
          message: 'Failed to resend OTP. Please try again later.',
          buttons: ['OK']
        });
        await alert.present();
      }
    );
  }

  startTimer(): void {
    const timerLimit = 1 * 60; 
    this.timerExpired = false;
    this.minutes = Math.floor(timerLimit / 60);
    this.seconds = timerLimit % 60;

    this.timer = setInterval(() => {
      if (this.seconds === 0) {
        if (this.minutes === 0) {
          clearInterval(this.timer);
          this.timerExpired = true;
        } else {
          this.minutes--;
          this.seconds = 59;
        }
      } else {
        this.seconds--;
      }
    }, 1000);
  }

  resetTimer(): void {
    clearInterval(this.timer);
    this.startTimer();
  }
}