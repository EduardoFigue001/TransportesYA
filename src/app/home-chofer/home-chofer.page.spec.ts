import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeChoferPage } from './home-chofer.page';

describe('HomeChoferPage', () => {
  let component: HomeChoferPage;
  let fixture: ComponentFixture<HomeChoferPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HomeChoferPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
