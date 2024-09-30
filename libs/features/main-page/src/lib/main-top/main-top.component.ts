import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import { LocalStorageService, NavigationService } from "@sp/core/providers";
import { CommonModule } from "@angular/common";

@Component({
  selector: 'sp-main-top',
  templateUrl: './main-top.component.html',
  styleUrls: ['./main-top.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class MainTopComponent {

  constructor(private readonly router: Router,
              public navService: NavigationService,
              private localStorageService: LocalStorageService) {
  }

    learnMore() {
    const path = this.navService.getUrlWithUtm('/');
    setTimeout(() => {
      this.router.navigate(['.'], {fragment: 'choose-path', queryParams: this.localStorageService.get("utm")});
    }, 50);
  }

}
