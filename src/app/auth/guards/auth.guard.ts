import { inject } from '@angular/core';
import { CanMatchFn, Route, Router, UrlSegment } from '@angular/router';
import { ActivatedRouteSnapshot, CanActivateFn, RouterStateSnapshot } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthService } from '../services/auth.service';



const checkAuthStatus = (): Observable<boolean> => {

  const authService: AuthService = inject(AuthService);
  const router: Router = inject(Router);

  return authService.checkAuthentication()
    .pipe(
      tap(isAuthenticated => {
        if (!isAuthenticated) {
          router.navigate(['/auth/login']);
        }
      })
    );

}

export const CanMatchGuard: CanMatchFn = (
    route: Route,
    segments: UrlSegment[]
  ) => {

  //console.log( 'Can Match Guard' );
  return checkAuthStatus();
}

export const CantActivateGuard: CanActivateFn = (
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ) => {

    //console.log( 'Can Activate Guard' );
    return checkAuthStatus();
}
