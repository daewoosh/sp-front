import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RangeTableDisplayComponent } from './range-table-display.component';

describe('RangeTableDisplayComponent', () => {
  let component: RangeTableDisplayComponent;
  let fixture: ComponentFixture<RangeTableDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RangeTableDisplayComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RangeTableDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
