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
  nextYear: number; 
  lastYear: number;
  presentingElement : any;
  averageGrade: number = 0;
  averageFirstGrading:number = 0;
  averageSecondGrading:number = 0;
  averageThirdGrading:number = 0;
  averageFourthGrading:number = 0;
  OldaverageFirstGrading:number = 0;
  OldaverageSecondGrading:number = 0;
  OldaverageThirdGrading:number = 0;
  OldaverageFourthGrading:number = 0;
 


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
    const currentYear = today.getFullYear();
      this.lastYear = currentYear - 1;
      this.currentYear = currentYear;
      this.nextYear = currentYear + 1;
    
   }

  

  ngOnInit() {
    if (this.isStudent && this.user.grades) {
      let totalFirstGrading = 0;
      let totalSecondGrading = 0;
      let totalThirdGrading = 0;
      let totalFourthGrading = 0;
      let totalSubjects = 0;
  
      this.user.grades.forEach((grade: any) => {
        totalFirstGrading += grade.first_grading;
        totalSecondGrading += grade.second_grading;
        totalThirdGrading += grade.third_grading;
        totalFourthGrading += grade.fourth_grading;
        totalSubjects++;
      });
  
      this.averageFirstGrading = totalFirstGrading / totalSubjects;
      this.averageSecondGrading = totalSecondGrading / totalSubjects;
      this.averageThirdGrading = totalThirdGrading / totalSubjects;
      this.averageFourthGrading = totalFourthGrading / totalSubjects;
    }

    if (this.isStudent && Array.isArray(this.user?.Oldgrades)) {
      let OldtotalFirstGrading = 0;
      let OldtotalSecondGrading = 0;
      let OldtotalThirdGrading = 0;
      let OldtotalFourthGrading = 0;
      let OldtotalSubjects = 0;
  
      this.user.Oldgrades.forEach((Oldgrade: any) => {
        OldtotalFirstGrading += Oldgrade.first_grading;
        OldtotalSecondGrading += Oldgrade.second_grading;
        OldtotalThirdGrading += Oldgrade.third_grading;
        OldtotalFourthGrading += Oldgrade.fourth_grading;
        OldtotalSubjects++;
      });
  
      if (OldtotalSubjects > 0) {
        this.OldaverageFirstGrading = OldtotalFirstGrading / OldtotalSubjects;
        this.OldaverageSecondGrading = OldtotalSecondGrading / OldtotalSubjects;
        this.OldaverageThirdGrading = OldtotalThirdGrading / OldtotalSubjects;
        this.OldaverageFourthGrading = OldtotalFourthGrading / OldtotalSubjects;
      }
    }
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
