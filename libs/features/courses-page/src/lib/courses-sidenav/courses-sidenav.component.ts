import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesProfileComponent } from "./courses-profile.component";
import { Course, UserProfile } from "@sp/core/models";
import { MenuItem } from "./menu-items";
import { CoursesMenuItemComponent } from "./courses-menu-item/courses-menu-item.component";
import { AppStateService } from "@sp/core/state";
import { map, Observable } from "rxjs";

@Component({
  selector: 'sp-courses-sidenav',
  standalone: true,
  imports: [CommonModule, CoursesProfileComponent, CoursesMenuItemComponent],
  templateUrl: './courses-sidenav.component.html',
  styleUrl: './courses-sidenav.component.scss',
})
export class CoursesSidenavComponent implements OnInit {
  profile: UserProfile = {
    telegramName: '@',
    role: 1,
    displayName: '',
    id: '-1',
  }

  profile$: Observable<UserProfile>;

  menuItems: MenuItem[] = [];
  logoutMenuItem: MenuItem = {
    icon: 'logout.svg',
    title: 'Выход',
    url: '/logout',
    isExternal: true,
  };
  supportMenuItem: MenuItem = {
    icon: 'help.svg',
    title: 'Поддержка',
    url: '/support',
    isExternal: true,
  };

  @Input() courses: Course[] = [];

  constructor(private appStateService: AppStateService) {
    this.profile$ = this.appStateService.selectUser
      .pipe(
        map(user => {
          return {
            ...user,
            telegramName: '@' + user.telegramName || '@',
          }
        })
      );
  }

  ngOnInit() {
    this.menuItems = this.courses.map(x => {
      return {
        icon: x.icon,
        title: x.title,
        url: x.slug,
      }
    });
    this.menuItems.unshift({icon: 'all-products.svg', url: '.', title: 'Все продукты'});
  }
}
