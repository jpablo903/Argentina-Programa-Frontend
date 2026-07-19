import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { AuthService } from '../servicios/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private authService: AuthService, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.authService.me().pipe(
      map(session => {
        if (!session) {
          this.router.navigate(['/']);
          return false;
        }

        const expectedRoles = route.data['expectedRol'] as string[];
        if (expectedRoles && expectedRoles.length > 0) {
          const userRoles = this.authService.getAuthorities();
          const hasRequiredRole = expectedRoles.some(role =>
            userRoles.includes(`ROLE_${role.toUpperCase()}`)
          );

          if (!hasRequiredRole) {
            this.router.navigate(['/']);
            return false;
          }
        }

        return true;
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return of(false);
      })
    );
  }
}
