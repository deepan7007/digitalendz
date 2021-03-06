import { Component, OnDestroy } from '@angular/core';
import { Location } from '@angular/common';

import { takeWhile } from 'rxjs/operators';
import { NbAuthComponent } from '@nebular/auth';

@Component({
  selector: 'md-auth',
  styleUrls: ['./auth.component.scss'],
  template: `
    <nb-layout>
      <nb-layout-column>
        <nb-card>
          <nb-card-body>
            <nb-auth-block>
              <router-outlet></router-outlet>
            </nb-auth-block>
          </nb-card-body>
        </nb-card>
      </nb-layout-column>
    </nb-layout>
  `,
})
export class AuthComponent extends NbAuthComponent {
}