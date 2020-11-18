import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CalhourComponent } from './calhour.component';

describe('ProjectComponent', () => {
  let component: CalhourComponent;
  let fixture: ComponentFixture<CalhourComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CalhourComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CalhourComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
