import { Injectable } from '@angular/core';
import { of, Observable } from 'rxjs';
import 'rxjs/add/observable/of';
import * as decode from 'jwt-decode';
import { UserData } from '../../../@core/data/users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  token_Payload = decode(localStorage.getItem('auth_app_token'));

  getUserName(): Observable<any> {
    return of(this.token_Payload.name);
  }

  getNplUserName() {
    return this.token_Payload.npi_username;
  }
}
