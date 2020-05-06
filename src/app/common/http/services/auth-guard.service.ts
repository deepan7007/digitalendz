import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot } from '@angular/router';
import { NbAuthService } from '@nebular/auth';
import { tap } from 'rxjs/operators';

@Injectable()
export class AuthGuard implements CanActivate {
  check: boolean = true;
  moduleList: Array<string> = [];

  constructor(private authService: NbAuthService, private router: Router) {
  }

  canActivate(state: ActivatedRouteSnapshot) {
    return this.hasModule(state) && this.authService.isAuthenticated()
      .pipe(
        tap(authenticated => {
          if (!authenticated) {
            this.router.navigate(['auth/login']);
          }
        }),
      );
  }
  hasModule(state): boolean {
    this.check = false;
    let modules = JSON.parse(localStorage.getItem('module_list'));

    if (modules == null || state.routeConfig.path == "" || state.routeConfig.path == "login") {
      return true;
    }
    else {
      modules.module.forEach(element => {
        if (!(element.indexOf(state.routeConfig.path) > -1) && !(state.routeConfig.path == "dashboard")) {
          this.check = true;
        }
      });
      if (state.routeConfig.path == "pages" || state.routeConfig.path == "dashboard" || state.routeConfig.path == "login" || state.routeConfig.path == "logout" || state.routeConfig.path == "change-password") {
        return true;
      } else if (this.check) {
        return true;
      } else { return false; }
    }

  }
}