import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AdvancedCoursePageComponent } from './advanced-course-page.component';

describe('AdvancedCoursePageComponent', () => {
  let component: AdvancedCoursePageComponent;
  let fixture: ComponentFixture<AdvancedCoursePageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdvancedCoursePageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AdvancedCoursePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
