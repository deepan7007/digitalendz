
import { Cell, DefaultEditor, Editor, ViewCell } from 'ng2-smart-table';
import { Component, Input, OnInit } from '@angular/core';
import { LinkElement } from '../../model/linkelement.model';
import { HttpClientService } from '../../../http/services/httpclient.service';
import { CommonFunctions } from '../../../service/commonfunctions.service';
import { Res } from '../../../http/models/res.model';
import { environment } from '../../../../../environments/environment';
import { BlobRes } from '../../../http/models/blobres.model';
import { NbToastrService } from '@nebular/theme';

@Component({
  template: `
  <button (click)="download(filepath)" ><i class = "fa fa-download"></i></button>
`,
})
export class SmartableServicecolumnComponent implements OnInit {
  @Input() value: string;
  
  constructor(private service: HttpClientService,
    private commonfunctions: CommonFunctions,
    private toasterService: NbToastrService) { }

  filepath = ""
  fileName: string;
  ngOnInit() {
    var string = JSON.stringify(this.value);
    var json = JSON.parse(string);
    this.filepath = json.FILE_LOCATION;
    this.fileName = json.FILE_NAME;
  };
  download(filepath) {
    let formData = { filepath: filepath };
    this.service.donwloadFile(environment.getAttachmentContent, formData).subscribe(
      (res: Blob) => {
            var url = window.URL.createObjectURL(res);
        var a = document.createElement("a");
        a.href = url;
        a.download = `${this.fileName}`;
        a.click();
        this.commonfunctions.showToast(this.toasterService, "success", "Success", "Document downloaded successfully");
        
      }
    );
  }
}


