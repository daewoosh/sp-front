import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OnlyPokerPageComponent } from './only-poker-page.component';

describe('OnlyPokerPageComponent', () => {
  let component: OnlyPokerPageComponent;
  let fixture: ComponentFixture<OnlyPokerPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OnlyPokerPageComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(OnlyPokerPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
