import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaveWorkComponent } from './save-work.component';

describe('SaveWorkComponent', () => {
  let component: SaveWorkComponent;
  let fixture: ComponentFixture<SaveWorkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaveWorkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveWorkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
