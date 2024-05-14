import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { ApiService } from '../api.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  constructor(private router: Router,
    private alertController: AlertController,
    private apiService: ApiService
  ) { }

  email: any;

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/login']);
  }

  async presentErrorAlert( message: string) {
    const alert = await this.alertController.create({
      header: 'Unsuccessful Request',
      message: message,
      buttons: ['OK']
    });

    await alert.present();
  }

  forgot() {
    if (!this.email) {
      this.presentErrorAlert("Enter the email linked to your account to reset your password.");
      return;
    }

    const studentData = {
      email: this.email,
    };

    this.apiService.forgot(studentData).subscribe(
      (response: any) => {
        if (response.status === "Success") {
          this.router.navigate(['./reset-password']);
        }
      },
      (error: any) => {
        console.error("Error:", error);
        this.presentErrorAlert("It seems your email isn't registered with us. Please check and retry."
      );
      }
    );
  }
}
