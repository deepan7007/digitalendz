import { Component, OnInit } from '@angular/core';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Location } from '@angular/common';


import { environment } from '../../../../environments/environment';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import {  NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'modules',
  templateUrl: './modules.component.html',
  styleUrls: ['./modules.component.scss']
})
export class ModulesComponent implements OnInit {
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
      SEMO_MODULE_NAME: {
        title: 'Module Name',
        type: 'string',
      },
      SEMO_DESCRIPTION: {
        title: 'Description',
        type: 'string',
      },
    },
  };
  
  source: LocalDataSource = new LocalDataSource();
  selectedsource: LocalDataSource = new LocalDataSource();
  constructor(private service: HttpClientService,
    private dialogRef: NbDialogRef<any>,
    private router: Router,
    private location: Location) {
    
    this.getModules();
   
  }
  
  getModules() {
    this.service.getData(environment.getModules)
      .subscribe(
        (modules:any[]) =>  {
          this.source.load(modules);
        }
      );
  }
  onCancel():void{
    this.dialogRef.close();
    
  }
  onAdd():void{
    this.dialogRef.close(this.selectedsource);
    
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
