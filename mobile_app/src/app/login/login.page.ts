import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  LRN!: number;
  password: string = '';
  passwordVisible: boolean = false;

  constructor(
    private router: Router, 
    private apiService: ApiService,
    private alertController: AlertController 
  ) {}

  ngOnInit() {}

  login() {
    this.apiService.login(this.LRN, this.password).subscribe(
      (res: any) => {
        if (res.status === 'Success') {
          this.handleApiResponse(res);
        } else {
          this.presentAlert('Invalid LRN or password.'); 
        }
      },
      (err) => {
        console.error('Error logging in:', err);
        this.presentAlert('Invalid LRN or password.'); 
      }
    );
  }

  handleApiResponse(response: any) {
    if (response.user && response.user.studentData) {
      // If additional student data exists
      const userDataWithStudentData = { ...response.user, ...response.user.studentData };
      this.router.navigate(['/landing'], { state: { user: userDataWithStudentData } });
    } else {
      this.router.navigate(['/landing'], { state: { user: response.user } });
    }
  }

  togglePasswordVisibility() {
    this.passwordVisible = !this.passwordVisible;
  }

  forgotpw() {
    this.router.navigate(['/forgot-password']);
  }

  signUp() {
    this.router.navigate(['/sign-up']);
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Alert',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
}
