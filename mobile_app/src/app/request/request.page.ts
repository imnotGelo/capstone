import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ApiService } from '../api.service';
import { AlertButton, AlertController } from '@ionic/angular';

@Component({
  selector: 'app-request',
  templateUrl: './request.page.html',
  styleUrls: ['./request.page.scss'],
})
export class RequestPage implements OnInit {
  user: any;
  file_requested:any;
  school_year:any;

  constructor(private router: Router,
    private apiService: ApiService,
    private alertController: AlertController) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras && navigation.extras.state) {
      this.user = navigation.extras.state['user'];
    } 
   }

  ngOnInit() {
  }

  back(){
    this.router.navigate(['/landing'])
  }

  forms(data: any) {
    this.apiService.requested(data).subscribe(
      (res: any) => {
        console.log("SUCCESS ===", res);
      },
      (error: any) => {
        alert('Try Again');
        console.log("ERROR ===", error);
      }
    );
  }

  submit() {
    if (this.validateForm()) {
      // Check if file_requested is empty
      if (!this.file_requested) {
        this.presentValidationErrorAlert('File Requested');
        return; 
      }
  
      if (this.file_requested === 'Diploma' || this.file_requested === 'Cert. of Graduation') {
        if (!this.school_year) {
          this.presentValidationErrorAlert('School Year');
          return; 
        }
      }
  
      const data = {
        student_name: `${this.user.firstname} ${this.user.middlename.charAt(0)} ${this.user.lastname}`,
        email: this.user.email,
        file_requested: this.file_requested,
        school_year: this.school_year
      };
  
      this.forms(data);
      this.success();
    } else {
      this.presentValidationErrorAlert('Form Data');
    }
  }
  
  validateForm(): boolean {
    return (
      this.user.firstname &&
      this.user.lastname &&
      this.user.email &&
      this.file_requested
    );
  }
  
  presentValidationErrorAlert(fieldName: string) {
    alert(`Please fill in the '${fieldName}' field with valid information.`);
  }
  
  async success() {
    const alert = await this.alertController.create({
      header: 'Documents Submitted',
      message: 'Thank you for submitting your request. Please allow 3-5 business days for a response.',
      buttons: ['OK']
    });
    await alert.present();
    this.router.navigate(['/landing'])
  }

  

}
