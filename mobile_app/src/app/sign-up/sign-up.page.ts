import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.page.html',
  styleUrls: ['./sign-up.page.scss'],
})
export class SignUpPage implements OnInit {

  lrn: any;
  firstname: any;
  middlename: any;
  lastname: any;
  email: string = '';
  password: any;
  confirmPassword: any;
  address: any;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;
  passwordMismatch: boolean = false;

  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService
  ) { }

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/login']);
  }

  async presentAlert(message: string) {
    const alert = await this.alertController.create({
      header: 'Registration Error',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  
  signUp() {
    if (!this.lrn || !this.firstname || !this.middlename || !this.lastname || !this.email || !this.password || !this.confirmPassword) {
      this.presentAlert('All fields are required.');
      return;
    }
    
    const studentData = {
      lrn: this.lrn,
      firstname: this.firstname,
      middlename: this.middlename,
      lastname: this.lastname,
      email: this.email,
      password: this.password,
      address: this.address,
    };
  
    this.apiService.signUp(studentData).subscribe(
      (response: any) => {
        if (response.status === "Success") {
          this.router.navigate(['./otp']); 
        } else {
          console.error("Error:", response.error);
        }
      },
      (error: any) => {
        console.error("Error:", error);
        this.presentErrorAlert();
      }
    );
  }

  presentErrorAlert() {
    alert('An error occurred. Please try again later.');
  }
  
  validatePasswords(): boolean {
    if (this.password !== this.confirmPassword) {
      this.presentMismatchAlert();
      return false;
    } else {
      return true;
    }
  }

  async presentMismatchAlert() {
    const alert = await this.alertController.create({
      header: 'Password Mismatch',
      message: 'Passwords do not match. Please try again.',
      buttons: ['OK']
    });
    await alert.present();
  }

  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }
}
