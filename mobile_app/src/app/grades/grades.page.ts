import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ActionSheetController } from '@ionic/angular';



@Component({
  selector: 'app-grades',
  templateUrl: './grades.page.html',
  styleUrls: ['./grades.page.scss'],
})
export class GradesPage implements OnInit {
  user: any;
  isStudent: boolean = false;
  currentYear: number = 0;
  nextYear: number  = 0;
  presentingElement : any;

  constructor(private router: Router,
    private actionSheetCtrl: ActionSheetController
  ) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras?.state) {
      const userData = navigation.extras.state['user'];
      if (userData && userData.studentData) {
        this.user = userData;
        this.isStudent = true;
        
      } else {
        this.user = userData;
        this.isStudent = false;
      }
    }
  

    const today = new Date();
    const currentMonth = today.getMonth() + 1;
    const currentYear = today.getFullYear();
    if (currentMonth >= 1 && currentMonth <= 5) {
      // If current month is between January and May, academic year is current year - 1 to current year
      this.currentYear = currentYear - 1;
      this.nextYear = currentYear;
    } else {
      // Otherwise, academic year is current year to current year + 1
      this.currentYear = currentYear;
      this.nextYear = currentYear + 1;
    }
   }

  

  ngOnInit() {
  }

  back() {
    this.router.navigate(['/landing']);
  }

  canDismiss = async () => {
    const actionSheet = await this.actionSheetCtrl.create({
      header: 'Are you sure?',
      buttons: [
        {
          text: 'Yes',
          role: 'confirm',
        },
        {
          text: 'No',
          role: 'cancel',
        },
      ],
    });

    actionSheet.present();

    const { role } = await actionSheet.onWillDismiss();

    return role === 'confirm';
  };
}
