import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { NavController } from '@ionic/angular';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  customRenderProgressbar = (progressbarFillClass: string): string => {
    return '<span class="' + progressbarFillClass + ' custom-progress-bar-fill"></span>';
  };

  constructor( private router: Router) {}

  swiperSlideChanged(e:any){
    console.log('change: ', e);
  }

  skip(){
    this.router.navigate(['/login']);
  }
}
