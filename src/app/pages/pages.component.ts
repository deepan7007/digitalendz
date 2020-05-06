import { Component, OnInit, ɵConsole } from '@angular/core';
import { NbMenuItem, NbMenuService } from '@nebular/theme';
import { HttpClientService } from '../common/http/services/httpclient.service';

// import { MENU_ITEMS } from './pages-menu';

@Component({
  selector: 'ngx-pages',
  styleUrls: ['pages.component.scss'],
  template: `
    <ngx-one-column-layout>
      <nb-menu [items]="menu"></nb-menu>
      <router-outlet></router-outlet>
    </ngx-one-column-layout>
  `,
})



export class PagesComponent implements OnInit {

  menu: NbMenuItem[];
  child: NbMenuItem[];
  group: NbMenuItem;
  returnValue: boolean;
  returnSecValue: boolean;
  returnProdValue: boolean;
  groupMod: any;
  token_Payload = JSON.parse(localStorage.getItem('module_list'));

  HTTPActivity: boolean;
  constructor(private menuService: NbMenuService, private httpSvc: HttpClientService) {
  }

  ngOnInit(): void {
    this.menu = this.loadModules();
  }

  private loadModules(): NbMenuItem[] {
    this.groupMod = [];

    this.token_Payload.module.forEach(element => {
      if (element[3] === 'Y') { this.groupMod.push(element[2]) };
    });

    this.groupMod = this.groupMod.filter((el, i, a) => i === a.indexOf(el));
    console.log("groups", this.groupMod);

    this.menu = [];
    this.menu.push({
      title: 'Dashboard',
      icon: 'home-outline',
      link: '/pages/dashboard',
      home: true,
    })
    this.group = { title: '', hidden: true };
    for (var i = 0; i < this.groupMod.length; i++) {
      this.menu.push(this.group, {
        title: this.groupMod[i],
        icon: 'grid-outline',
        children: this.getChildren(this.groupMod[i])
      })

    }
    return this.menu;
  }


  getChildren(parentMod): NbMenuItem[] {
    this.child = [];
    this.token_Payload.module.forEach(element => {

      if (parentMod === element[2] && element[3] == "Y") {
        this.child.push({
          title: element[0],
          icon: 'layout',
          link: element[1],
        })
      }
    });
    return this.child;
  }


}
