import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BoosterPageComponent } from './booster-page.component';

describe('BoosterPageComponent', () => {
  let component: BoosterPageComponent;
  let fixture: ComponentFixture<BoosterPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoosterPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(BoosterPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
