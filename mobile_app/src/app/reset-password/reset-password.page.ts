import { Component, OnInit } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../api.service';
import { CheckboxCustomEvent } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  password: any;
  confirmPassword: any;
  passwordVisible: boolean = false;
  confirmPasswordVisible: boolean = false;


  constructor(
    private router: Router,
    private alertController: AlertController,
    private apiService: ApiService,
  ) { }

  ngOnInit() {
  }


  togglePasswordVisibility(field: string) {
    if (field === 'password') {
      this.passwordVisible = !this.passwordVisible;
    } else if (field === 'confirmPassword') {
      this.confirmPasswordVisible = !this.confirmPasswordVisible;
    }
  }

  resetPassword() {
    if (this.password.length < 8 || !/[.!@#$%^&*()_+{}\[\]:;<>,.?\/\\~-]/.test(this.password)) {
      this.showAlert('Password Error', 'Password must be at least 8 characters long and contain a combination of periods or symbols.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.showAlert('Password Error', 'Passwords do not match.');
      return;
    }

    const studentData = {
      password: this.password,
    };
  
    this.apiService.resetPW(studentData).subscribe(
      (response: any) => {
        if (response.status === "Success") {
          this.router.navigate(['./done']);
        }
      },
      (error: any) => {
        console.error("Error:", error);
        this.presentErrorAlert("An unexpected error occurred."
      );
      }
    );
  }

  async presentErrorAlert( message: string) {
    const alert = await this.alertController.create({
      header: 'Unsuccessful Request',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }
  

  async showAlert(header: string, message: string) {
    const alert = await this.alertController.create({
      header: header,
      message: message,
      buttons: ['OK']
    });
    await alert.present();
  }
}
