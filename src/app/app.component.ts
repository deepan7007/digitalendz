import { Component, ViewChild, TemplateRef, ElementRef, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';

import { Idle, DEFAULT_INTERRUPTSOURCES } from '@ng-idle/core';
import { Keepalive } from '@ng-idle/keepalive';

import { BsModalService } from 'ngx-bootstrap/modal';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { NbAuthService } from '@nebular/auth';
import { UserService } from './common/http/services/users.service';
import { AnalyticsService } from './@core/utils';

@Component({
  selector: 'ngx-app',
  styles: ['.mrgbtm { margin-top: 40px; }'],
  template: `<router-outlet></router-outlet>
  <div bsModal #childModal="bs-modal" class="modal fade" tabindex="-1" role="dialog" aria-labelledby="dialog-child-name">
      <div class="modal-dialog modal-dialog-centered">
          <div class="modal-content">
              <div class="modal-header">
                  <h4 id="dialog-child-name" class="modal-title pull-left">Oooops!!!! Still awake ? </h4>
                  <button type="button" class="close pull-right" aria-label="Close" (click)="hideChildModal()">
                      <span aria-hidden="true">&times;</span>
                  </button>
              </div>
              <div class="modal-body">
                  Snap!!! You have not been active for a while. Press Stay Logged in to continue or 
                  {{idleState}}
              </div>
              <div class="modal-footer">
              <button (click)="logout()" class="btn btn-secondary" data-dismiss="modal">Logout</button>
              <button (click)="stay()" class="btn btn-primary">Stay Logged In</button>
            </div>
          </div>
      </div>
  </div>`,
})
export class AppComponent {

  idleState = 'Not started.';
  timedOut = false;
  lastPing?: Date = null;
  title = 'angular-idle-timeout';

  public modalRef: BsModalRef;

  @ViewChild('childModal', { static: false }) childModal: ModalDirective;

  constructor(private idle: Idle, 
    private keepalive: Keepalive,
    private router: Router, 
    private analytics: AnalyticsService) {
      
    idle.setIdle(30);
    idle.setTimeout(10);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    idle.onIdleEnd.subscribe(() => {
      this.idleState = 'No longer idle.'
      this.reset();
    });

    idle.onTimeout.subscribe(() => {
      this.childModal.hide();
      this.idleState = 'Timed out!';
      this.timedOut = true;
      this.logout()
    });

    idle.onIdleStart.subscribe(() => {
      this.idleState = 'You\'ve gone idle!'
      this.childModal.show();
    });

    idle.onTimeoutWarning.subscribe((countdown) => {
      this.idleState = 'You will be logged out in ' + countdown + ' seconds!'
    });

    // sets the ping interval to 15 seconds
    keepalive.interval(15);

    keepalive.onPing.subscribe(() => this.lastPing = new Date());

    this.analytics.getUserLoggedIn().subscribe(userLoggedIn => {
      if (userLoggedIn) {
        idle.watch()
        this.timedOut = false;
      } else {
        idle.stop();
      }
    })
  }

  reset() {
    this.idle.watch();
    this.timedOut = false;
  }

  hideChildModal(): void {
    this.childModal.hide();
  }

  stay() {
    this.childModal.hide();
    this.reset();
  }

  logout() {
    this.childModal.hide();
    localStorage.clear();
    this.analytics.setUserLoggedIn(false);
    this.router.navigate(['/auth/login']);
  }

  ngOnInit() {
    this.analytics.trackPageViews();
  }

}
