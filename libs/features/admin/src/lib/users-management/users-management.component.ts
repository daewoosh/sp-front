import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdminApiService } from '../admin.api.service';
import { ActivatedRoute, Router } from '@angular/router';
import { UserCourseInfo } from '../models';
import { BehaviorSubject, catchError, of, switchMap } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'sp-users-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './users-management.component.html',
  styleUrl: './users-management.component.scss',
})
export class UsersManagementComponent implements OnInit {
  user!: UserCourseInfo | null;
  pageSize = 50;
  pageNumber = 0;
  isLoading$ = new BehaviorSubject(true);
  total = -1;
  query = '';

  constructor(
    private adminApiService: AdminApiService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams
      .pipe(
        switchMap((params) => {
          const tgName = params['tgName'];
          if (!tgName) {
            return of(null);
          } else {
            this.query = tgName;
            return this.adminApiService.findUser(tgName).pipe(
              catchError(() => {
                return of(null);
              })
            );
          }
        })
      )
      .subscribe({
        next: (user) => (this.user = user ?? null),
        error: (err) => console.log({ err }),
      });
  }

  search() {
    if (this.query) {
      this.router.navigate([], { queryParams: { tgName: this.query } });
    }
  }

  toggleAccessState(id: number) {
    const confirmed = confirm('Вы уверены?');
    if (confirmed) {
      this.adminApiService
        .toggleCourseAccess(id, this.user?.userId ?? -1)
        .subscribe({
          next: () => {
            window.location.reload();
          },
        });
    }
  }

  grantFullAccess(id: number) {
    const confirmed = confirm('Выдать полный доступ к курсу?');
    if (confirmed) {
      this.adminApiService
        .grantCourseAccess(id, this.user?.userId ?? -1, null)
        .subscribe({
          next: () => {
            window.location.reload();
          },
        });
    }
  }

  grantAccess(id: number, value: string) {
    const confirmed = confirm(`Выдать полный доступ к ${value} урокам?`);
    if (confirmed) {
      this.adminApiService
        .grantCourseAccess(id, this.user?.userId ?? -1, +value)
        .subscribe({
          next: () => {
            window.location.reload();
          },
        });
    }
  }
}
