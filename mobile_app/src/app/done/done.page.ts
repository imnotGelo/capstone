import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-done',
  templateUrl: './done.page.html',
  styleUrls: ['./done.page.scss'],
})
export class DonePage implements OnInit {

  constructor(
    private router: Router,
  ) { }

  ngOnInit() {
  }

  login() {
    this.router.navigate(['/login']);
  }

}
