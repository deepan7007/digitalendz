import { Component, OnInit, OnDestroy } from '@angular/core';

import { takeUntil } from 'rxjs/operators';
import { UserService } from '../../common/http/services/users.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'ngx-dashboard',
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit, OnDestroy {
  user: any;
  private destroy$: Subject<void> = new Subject<void>();

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.userService.getUserName()
      .pipe(takeUntil(this.destroy$))
      .subscribe((users: any) => this.user = users);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
