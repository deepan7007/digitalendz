import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'hyperloop',
  template: `
  <router-outlet></router-outlet>
`,
})
export class HyperloopComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }

}
