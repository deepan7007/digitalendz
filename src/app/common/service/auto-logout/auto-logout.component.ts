import { Component, OnInit } from '@angular/core';
import { AutoLogoutService } from './auto-logout.service';

@Component({
  selector: 'auto-logout',
})
export class AutoLogoutComponent implements OnInit {

  constructor(private autoLogoutService: AutoLogoutService) { }

  ngOnInit() {
    localStorage.setItem('lastAction', Date.now().toString());
  }
}
