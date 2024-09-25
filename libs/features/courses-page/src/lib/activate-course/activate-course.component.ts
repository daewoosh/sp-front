import { Component, inject, INJECTOR, Input as RouterInput, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AppStateService } from "@sp/core/state";
import { ActivatedRoute, Router } from "@angular/router";
import { LoginModalComponent } from "@sp/common/login-modal/login-modal.component";
import { CourseActivationService } from "@sp/core/providers";
import { CoursesApiService } from "../courses-api.service";
import { catchError, of, switchMap, take } from "rxjs";
import { PolymorpheusComponent } from "@taiga-ui/polymorpheus";
import { TuiDialogService } from "@taiga-ui/core";

@Component({
  selector: 'sp-activate-course',
  standalone: true,
  imports: [CommonModule, LoginModalComponent],
  templateUrl: './activate-course.component.html',
  styleUrl: './activate-course.component.scss',
  providers: [{provide: CourseActivationService, useClass: CoursesApiService}]
})
export class ActivateCourseComponent implements OnInit{
  @RouterInput() token!: string;
  isLoggedIn$ = of(false);
  private readonly dialogs = inject(TuiDialogService);
  private readonly injector = inject(INJECTOR);
  private readonly dialog = this.dialogs.open<number>(
    new PolymorpheusComponent(LoginModalComponent, this.injector),
    {
      data: 237,
      dismissible: true,
      appearance: 'sp-modal'
    },
  );

  constructor(private appStateService: AppStateService,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private courseActivationService: CourseActivationService,
  ) {
    this.isLoggedIn$ = this.appStateService.isLoggedIn$.pipe(take(1));
  }

  ngOnInit() {
    this.isLoggedIn$.pipe(
    switchMap(isLoggedIn => {
      if (isLoggedIn) {
        // Если пользователь залогинен, активируем курс
        return this.courseActivationService.activateCourse(this.token).pipe(
          switchMap(() => {
            // После активации перенаправляем на страницу курсов
            return this.router.navigate(['/courses']);
          }),
          catchError((err) => {
              return this.router.navigate(['/courses'])
            }
          )
        );
      } else {
        // Если пользователь не залогинен, возвращаем false
        return of(false)
      }
    })
  ).subscribe();
  }

  openModal() {
    this.dialog.subscribe();
  }
}
