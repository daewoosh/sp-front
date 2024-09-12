import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BeginnerCoursePageComponent } from './beginner-course-page.component';

describe('BeginnerCoursePageComponent', () => {
  let component: BeginnerCoursePageComponent;
  let fixture: ComponentFixture<BeginnerCoursePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BeginnerCoursePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BeginnerCoursePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
