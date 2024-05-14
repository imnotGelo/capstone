import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DonePage } from './done.page';

describe('DonePage', () => {
  let component: DonePage;
  let fixture: ComponentFixture<DonePage>;

  beforeEach(async(() => {
    fixture = TestBed.createComponent(DonePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
