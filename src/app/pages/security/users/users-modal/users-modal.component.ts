import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';

import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { environment } from '../../../../../environments/environment';
import { HttpClientService } from '../../../../common/http/services/httpclient.service';
import { Res } from '../../../../common/http/models/res.model';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'users',
  templateUrl: './users-modal.component.html',
  styleUrls: ['./users-modal.component.scss']
})
export class UsersModalComponent implements OnInit {
  selectedrows:{};
settings = {
    actions: false,
    selectMode: 'multi',
    
    add: { 
      addButtonContent: '<i class="nb-plus"></i>',
      createButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    edit: {
      editButtonContent: '<i class="nb-edit"></i>',
      saveButtonContent: '<i class="nb-checkmark"></i>',
      cancelButtonContent: '<i class="nb-close"></i>',
    },
    delete: {
      deleteButtonContent: '<i class="nb-trash"></i>',
      confirmDelete: true,
    },
    columns: {
      /*SEMO_ID: {
        title: 'Role ID',
        type: 'number',
      },*/
      SEUS_USER_NAME: {
        title: 'User Name',
        type: 'string',
      },
      SEUS_USER_ID: {
        title: 'User ID',
        type: 'string',
      },
    },
  };
  
  source: LocalDataSource = new LocalDataSource();
  selectedsource: LocalDataSource = new LocalDataSource();
  constructor(private service: HttpClientService,
    private activeModal: NbDialogRef<any>,
    private router: Router,
    private location: Location) {
    
    this.getUsers();
   
  }
  
  getUsers() {
    
    this.service.getData(environment.getUsers)
      .subscribe(
        (users:Res) =>  {
          this.source.load(users.data);
        }
      );
  }
  onCancel():void{
    this.activeModal.close();
    
  }
  onAdd():void{
    this.activeModal.close(this.selectedsource);
    
  }
  rowClicked(event): void {
    this.selectedsource.empty();
    this.selectedsource.add(event.selected);
  }
  onDeleteConfirm(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      event.confirm.resolve();
    } else {
      event.confirm.reject();
    }
  }

  ngOnInit() {
  }


}
