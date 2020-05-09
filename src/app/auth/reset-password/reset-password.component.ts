import { Component, OnInit } from '@angular/core';
import { NbResetPasswordComponent, NbAuthResult } from '@nebular/auth';
import * as decode from 'jwt-decode';

@Component({
  selector: 'reset-password',
  templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent extends NbResetPasswordComponent {

  getUser() {
    const token_Payload = decode(localStorage.getItem('auth_app_token'));
    return this.user.email = token_Payload.email;
  }

}
