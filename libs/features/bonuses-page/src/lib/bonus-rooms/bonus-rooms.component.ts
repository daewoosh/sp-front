import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { BreakpointObserver } from "@angular/cdk/layout";
import { CommonModule } from "@angular/common";
import { TuiCarousel, TuiCarouselButtons, TuiCarouselComponent, TuiPagination } from "@taiga-ui/kit";

@Component({
  selector: 'sp-bonus-rooms',
  templateUrl: './bonus-rooms.component.html',
  styleUrls: ['./bonus-rooms.component.scss'],
  standalone: true,
  imports: [CommonModule, TuiPagination, TuiCarousel],
})
export class BonusRoomsComponent implements OnInit {

  itemsCount = 2;
  index = 0;

  rooms: string[] = [
    "bonus_logo1_pokerok.svg",
    "bonus_logo2_gg-poker.webp",
    "bonus_logo3_acr.svg",
    "bonus_logo4_redstar.webp",
    "bonus_logo5_pokerstars.svg",
    "bonus_logo6_pokerking.svg",
    "bonus_logo7_-pokerdom.webp",
    "bonus_logo8_coinpoker.svg",
    "bonus_logo9_rpt-bet.webp",
    "bonus_logo10_1win.webp"
  ]

  constructor(private breakPointObserver: BreakpointObserver,
              private cdr: ChangeDetectorRef) {
  }

  get rounded(): number {
    return Math.floor(this.index / this.itemsCount);
  }

  ngOnInit(): void {
    this.breakPointObserver.observe([
      "(min-width: 0px) and (max-width: 449px)",
      "(min-width: 450px) and (max-width: 649px)",
      "(min-width: 650px) and (max-width: 849px)",
      "(min-width: 850px) and (max-width: 1049px)",
      "(min-width: 1050px)"
    ]).subscribe(
      res => {
        if (res.breakpoints["(min-width: 1050px)"]) {
          console.log('setting 5');
          this.itemsCount = 5;
        } else if (res.breakpoints["(min-width: 850px) and (max-width: 1049px)"]) {
          console.log('setting 4');
          this.itemsCount = 4;
        } else if (res.breakpoints["(min-width: 650px) and (max-width: 849px)"]) {
          console.log('setting 3');
          this.itemsCount = 3;
        } else if (res.breakpoints["(min-width: 450px) and (max-width: 649px)"]) {
          console.log('setting 2');
          this.itemsCount = 2;
        } else if (res.breakpoints["(min-width: 0px) and (max-width: 449px)"]) {
          console.log('setting 1');
          this.itemsCount = 1;
        }
        this.cdr.detectChanges();
        this.index = 0;
      }
    );

  }

  onIndex(index: number): void {
    this.index = (index * this.itemsCount);
  }


  navigate(delta: number) {
    this.index = (this.index + delta) % 10;
    if (this.index < 0) {
      this.index = this.rooms.length + delta;
    }
  }

}
