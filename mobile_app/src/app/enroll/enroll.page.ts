import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from '../api.service';
import { AlertController } from '@ionic/angular';



@Component({
  selector: 'app-enroll',
  templateUrl: './enroll.page.html',
  styleUrls: ['./enroll.page.scss'],
})
export class EnrollPage implements OnInit {
  user: any;
  good_moral: any;
  birth_cert: any;
  cert_trans: any;
  report_card: any;
  grade_level:any;
  strand:any;
  isStudent: boolean = false;
  isOld: boolean = false;


  constructor(private route: ActivatedRoute,
    private router: Router,
    private apiService: ApiService,
    private alertController: AlertController) {
      const navigation = this.router.getCurrentNavigation();
      if (navigation?.extras?.state) {
        const userData = navigation.extras.state['user'];
        if (userData && userData.studentData && userData.sectionData) {
          this.user = userData;
          this.isStudent = true;
        } else {
          this.user = userData;
          this.isStudent = false;
        }
      }  
  }

  setIsOld(isOld: boolean) {
    this.isOld = isOld;
  }
  
  ngOnInit() {
  }

  landing(){
    this.router.navigate(['/landing'])
  }
  enroll(){
    this.router.navigate(['/landing'])
  }

  async presentValidationErrorAlert() {
    const alert = await this.alertController.create({
      header: 'Validation Error',
      message: 'Please fill out all required fields.',
      buttons: ['OK']
    });

    await alert.present();
  }

  async success() {
    const alert = await this.alertController.create({
      header: 'Application Submitted',
      message: 'Please wait for the enrollment status in your email.',
      buttons: ['OK']
    });
    await alert.present();
    this.router.navigate(['/landing'])
  }

  async DuplicateAlert() {
    const alert = await this.alertController.create({
      header: 'Duplicate Submission',
      message: 'Your application has already been received. Kindly wait for your email to confirm your enrollment status.',
      buttons: ['OK']
    });
    await alert.present();
  }
  
  onFileChange(event: any, fileType: string) {
    const file = event.target.files[0];
    if (fileType === 'report_card') {
      this.report_card = file;
    } else if (fileType === 'good_moral') {
      this.good_moral = file;
    } else if (fileType === 'birth_cert') {
      this.birth_cert = file;
    } else if (fileType === 'cert_trans') {
      this.cert_trans = file;
    }
  }


  addStudent(studentData: any) {
    this.apiService.addStudent(studentData).subscribe(
      (res: any) => {
        console.log("SUCCESS ===", res);
        if (res.status === 'Success') {
          this.success(); 
        }
      },
      (error: any) => {
        if (error.status === 406) { // Check for status code 406
          this.LRNisExist();
        } else {
          this.DuplicateAlert();
        }
      }
    );
  }

  addOldStudent(oldstudentData: any) {
    this.apiService.addOldStudent(oldstudentData).subscribe(
      (res: any) => {
        console.log("SUCCESS ===", res);
        if (res.status === 'Success') {
          this.success(); 
        }
      },
      (error: any) => {
        if (error.status === 406) { // Check for status code 406
          this.LRNisNotExist();
        } else {
          this.DuplicateAlert();
        }
      }
    );
  }

  NewEnroll() {
    if (!this.good_moral || !this.birth_cert || !this.cert_trans || !this.report_card || !this.grade_level) {
      this.presentValidationErrorAlert();
      return;
    }
  
    const newData = new FormData();
    newData.append('LRN', this.user.LRN);
    newData.append('firstname', this.user.firstname);
    newData.append('middlename', this.user.middlename);
    newData.append('lastname', this.user.lastname);
    newData.append('email', this.user.email);
    newData.append('address', this.user.address);
    newData.append('report_card', this.report_card);
    newData.append('good_moral', this.good_moral);
    newData.append('birth_cert', this.birth_cert);
    newData.append('cert_trans', this.cert_trans);
    newData.append('grade_level', this.grade_level);

    if (this.grade_level === '11' || this.grade_level === '12') {
      newData.append('strand', this.strand);
    }
    this.addStudent(newData);
  }

  OldEnroll() {
    if (!this.report_card || !this.grade_level) {
      this.presentValidationErrorAlert();
      return;
    }
  
    const formData = new FormData();
    formData.append('LRN', this.user.LRN);
    formData.append('firstname', this.user.firstname);
    formData.append('middlename', this.user.middlename);
    formData.append('lastname', this.user.lastname);
    formData.append('email', this.user.email);
    formData.append('address', this.user.address);
    formData.append('report_card', this.report_card);
    formData.append('grade_level', this.grade_level);

    if (this.grade_level === '11' || this.grade_level === '12') {
      formData.append('strand', this.strand);
    }
    this.addOldStudent(formData);
  }

  async LRNisExist() {
    const alert = await this.alertController.create({
      header: 'Validation',
      message: 'According to our records, your LRN is already in the system. When enrolling, please select Old.',
      buttons: ['OK'],
      cssClass: 'validation-message' 
    });
    await alert.present();
  }

  async LRNisNotExist() {
    const alert = await this.alertController.create({
      header: 'Validation',
      message: 'You do not have any records in our system. When enrolling, please choose Old.',
      buttons: ['OK']
    });
    await alert.present();
  }
}
