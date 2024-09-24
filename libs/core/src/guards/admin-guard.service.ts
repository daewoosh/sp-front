import { Injectable } from "@angular/core";
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot
} from "@angular/router";
import { AppStateService } from "../state";
import { concatMap, of, tap } from "rxjs";
import { ClientService } from "../guards";

@Injectable()
export class AdminGuard implements CanActivate {
  constructor(
    private clientService: ClientService,
    private router: Router,
    private appStateService: AppStateService
  ) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): MaybeAsync<GuardResult> {
    return this.clientService.checkAuthenticatedStatus().pipe(
      concatMap((result) => {
        if (!result) {
          return of(false);
        }
        return this.appStateService.isAdmin$;
      }),
      tap((result: boolean) => {
        if (!result) {
          this.router.navigate(['/']);
        }
      })
    );
  }


}
