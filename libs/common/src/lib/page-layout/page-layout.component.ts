import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  ActivatedRoute,
  ActivatedRouteSnapshot,
  NavigationEnd,
  NavigationStart,
  Router,
  RouterModule
} from "@angular/router";
import { HeaderComponent } from "../header";
import { FooterComponent } from "../footer";
import { filter } from "rxjs";

@Component({
  selector: 'sp-page-layout',
  standalone: true,
  imports: [CommonModule, RouterModule, HeaderComponent, FooterComponent],
  templateUrl: './page-layout.component.html',
  styleUrl: './page-layout.component.scss',
})
export class PageLayoutComponent implements OnInit {

  showFooter = true;

  constructor(private activatedRoute: ActivatedRoute, private router: Router) {
    // Подписка на события маршрутизации для отслеживания изменений
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        // Получаем текущий активный маршрут
        let currentRoute = this.activatedRoute;

        // Спускаемся вниз по дереву маршрутов, чтобы получить данные дочерних маршрутов
        while (currentRoute.firstChild) {
          currentRoute = currentRoute.firstChild;
        }

        // Подписываемся на данные текущего маршрута
        currentRoute.data.subscribe(data => {
          this.showFooter = !data['hideFooter'];
        });
      });
  }

  ngOnInit(): void {
    // // Подписка на события маршрутизации для отслеживания изменений
    // this.router.events
    //   .pipe(filter(event => event instanceof NavigationEnd))
    //   .subscribe(() => {
    //     console.log('NavigationEnd');
    //     // Получаем текущий активный маршрут
    //     let currentRoute = this.activatedRoute;
    //
    //     // Спускаемся вниз по дереву маршрутов, чтобы получить данные дочерних маршрутов
    //     while (currentRoute.firstChild) {
    //       currentRoute = currentRoute.firstChild;
    //     }
    //
    //     // Подписываемся на данные текущего маршрута
    //     currentRoute.data.subscribe(data => {
    //       console.log(data);
    //       this.showFooter = !data['hideFooter'];
    //     });
    //   });
  }
}
