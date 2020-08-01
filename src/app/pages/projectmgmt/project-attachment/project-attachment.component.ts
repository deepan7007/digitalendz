import { Component, OnInit, Output, Input, HostBinding, EventEmitter, ElementRef, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { CommonFunctions } from '../../../common/service/commonfunctions.service';
import { environment } from '../../../../environments/environment';
import { Res } from '../../../common/http/models/res.model';
import { HttpClientService } from '../../../common/http/services/httpclient.service';
import { Filter } from '../../../common/http/Models/filter.model';
import { LocalDataSource } from 'ng2-smart-table';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

import { SmartableServicecolumnComponent } from '../../../common/smartable/component/smartable-servicecolumn/smartable-servicecolumn.component';
import { NbToastrService } from '@nebular/theme';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'project-attachment',
  templateUrl: './project-attachment.component.html',
  styleUrls: ['./project-attachment.component.scss']
})
export class ProjectAttachmentComponent implements OnInit {

  @Input() pjtId: string;
  formGroup: FormGroup;
  uploadForm: FormGroup;
  PMAT_ATTACHMENT_TYPE = [];
  documentType = ""
  attachments = [];
  public hasBaseDropZoneOver: boolean = false;
  public hasAnotherDropZoneOver: boolean = false;
  uploader: FileUploader = new FileUploader({ url: environment.saveProjectAttachmentDetails, itemAlias: 'file', authToken: JSON.stringify(localStorage.getItem('auth_app_token')) });
  source: LocalDataSource = new LocalDataSource();

  constructor(private formBuilder: FormBuilder,
    private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService,
    private router: Router,
    private location: Location,
  ) { }

  ngOnInit() {

    this.formGroup = this.formBuilder.group({
      PMPRJ_ID: ['',],
      PMAT_ATTACHMENT_TYPE: ['',],
    });
    this.getAttachments(this.pjtId);
    this.uploader.onBuildItemForm = (fileItem: any, form: any) => {
      form.append('PMPRJ_ID', fileItem.formData.PMPRJ_ID); //note comma separating key and value
      form.append('PMAT_ATTACHMENT_TYPE', this.formGroup.value.PMAT_ATTACHMENT_TYPE);
    };
    this.uploader.onAfterAddingFile = (fileItem: any) => {
      fileItem.formData.PMPRJ_ID = this.pjtId;
      fileItem.formData.PMAT_ATTACHMENT_TYPE = this.formGroup.value.PMAT_ATTACHMENT_TYPE;
    }
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var json = JSON.parse(response);
      if (json.return_code == 0) {
        item.remove();
        this.getAttachments(this.pjtId);
      }
    };
  }

  public fileOverBase(e: any): void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e: any): void {
    this.hasAnotherDropZoneOver = e;
  }

  getAttachments(pjtId) {
    var filters: Filter[] = [{
      name: "PMPRJ_ID",
      value: this.pjtId
    }];
    this.service.getDatawithFilters(environment.getProjectAttachmentDetails, filters)
      .subscribe(
        (attachmentdetails: Res) => {
          this.source.load(attachmentdetails.data);
          this.attachments = attachmentdetails.data;
        }
      );
  }

  onDelete(event): void {
    if (window.confirm('Are you sure you want to delete?')) {
      this.attachments.forEach(elements => {
        // console.log('==>'+ elements.PMAT_ID+'-->'+event.data.PMAT_ID);
        if (elements.PMAT_ID == event.data.PMAT_ID) {
          var formData = {
            "PMAT_ID": event.data.PMAT_ID,
            "PMPRJ_ID": this.pjtId,
            "PMAT_ATTACHMENT_LOCATION": elements.PMAT_ATTACHMENT_LOCATION
          };
          this.service.postData(environment.deleteProjectAttachment, formData).subscribe(
            (res: Res) => {
              if (res.return_code != 0) {
                this.commonfunctions.showToast(this.toasterService, "error", "Error Deleting Document", res.return_message);
                event.confirm.reject();
                return;
              }
              else {
                this.commonfunctions.showToast(this.toasterService, "success", "Success", "Document deleted successfully");
                event.confirm.resolve(event);
              }
            }
          );
        }
      });
    } else {
      event.confirm.reject();
    }
  }

  settings = {
    actions: {
      add: false, edit: false, delete: true, position: 'right'
    },
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
      PMAT_ID: {
        title: 'PMAT_ID',
        type: 'number',
      },
      PMPR_ID: {
        title: 'PMPR_ID',
        type: 'number',
      },
      PMAT_ATTACHMENT_TYPE: {
        title: 'Document Type',
        type: 'string',
      },
      PMAT_ORIGINAL_FILENAME: {
        title: 'File Name',
        type: 'string',
      },
      DOWNLOAD: {
        title: 'Download',
        type: 'custom',
        valuePrepareFunction: (value, row) => {
          let linkelement = {
            servicname: environment.getProjectAttachmentDetails,
            PMAT_ID: row.PMAT_ID,
            FILE_LOCATION: row.PMAT_ATTACHMENT_LOCATION,
            FILE_NAME: row.PMAT_ORIGINAL_FILENAME,
          };
          return linkelement
        },
        renderComponent: SmartableServicecolumnComponent
      },
    },
  };

}
