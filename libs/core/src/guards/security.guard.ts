import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, CanLoad, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { AppStateService } from "../state";
import { ClientService } from "../guards";

@Injectable()
export class AuthGuard implements CanActivate, CanLoad {
  constructor(private httpClient: HttpClient,
              private appStateService: AppStateService,
              private router: Router,
              private clientService: ClientService,
  ) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.canLoad();
  }

  canLoad(): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.clientService.checkAuthenticatedStatus().pipe(
      tap((result: boolean) => {
        if (!result) {
          this.router.navigate(['/']);
        }
      })
    );
  }
}


