import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoursesProfileComponent } from "./courses-profile.component";
import { Course, UserProfile } from "@sp/core/models/user-profile";
import { MenuItem } from "./menu-items";
import { CoursesMenuItemComponent } from "./courses-menu-item/courses-menu-item.component";

@Component({
  selector: 'sp-courses-sidenav',
  standalone: true,
  imports: [CommonModule, CoursesProfileComponent, CoursesMenuItemComponent],
  templateUrl: './courses-sidenav.component.html',
  styleUrl: './courses-sidenav.component.scss',
})
export class CoursesSidenavComponent implements OnInit {
  profile: UserProfile = {
    userName: 'Vasia Petya',
    telegramName: '@vasiapetya'
  }

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


  ngOnInit() {
    this.menuItems = this.courses.map(x => {
      return {
        icon: x.icon,
        title: x.title,
        url: x.slug + '/1',
      }
    });
    this.menuItems.unshift({icon: 'all-products.svg', url: '.', title: 'Все продукты'});
  }
}
