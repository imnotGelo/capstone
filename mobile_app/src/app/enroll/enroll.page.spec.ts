import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EnrollPage } from './enroll.page';

describe('EnrollPage', () => {
  let component: EnrollPage;
  let fixture: ComponentFixture<EnrollPage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(EnrollPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
