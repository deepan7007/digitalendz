
import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot } from '@angular/router';

import { urlBase64Decode } from '@nebular/auth/helpers'

import * as decode from 'jwt-decode';
import { NbAuthService } from '@nebular/auth';

@Injectable()
export class RoleGuard implements CanActivate {

  constructor(public auth: NbAuthService, public router: Router) {}

  canActivate(route: ActivatedRouteSnapshot): boolean {

    // this will be passed from the route config
    // on the data property
    const expectedRole = route.data.expectedRole;
    const token = localStorage.getItem('auth_app_token');
    const tokenPayload = decode(token);
    
    
    if (!this.auth.isAuthenticated() || tokenPayload.role !== expectedRole) {
      this.router.navigate(['/pages/dashboard']);
      return false;
    }
    return true;
  }

}