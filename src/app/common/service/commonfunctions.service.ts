
import { Injectable } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';


import { environment } from '../../../environments/environment';
import { DatePipe } from '@angular/common';
import { Res } from '../../common/http/models/res.model';
import { HttpClientService } from '../../common/http/services/httpclient.service';
import { NbToastrService } from '@nebular/theme';


@Injectable()
export class CommonFunctions {
  constructor(private service: HttpClientService,

  ) {

  }
  isNull(value) {
    return value === null;
  }
  isUndefined(value) {
    return typeof value === 'undefined';
  }

  types: string[] = ['default', 'info', 'success', 'warning', 'error'];
  animations: string[] = ['fade', 'flyLeft', 'flyRight', 'slideDown', 'slideUp'];
  positions: string[] = ['toast-top-full-width', 'toast-bottom-full-width', 'toast-top-left', 'toast-top-center',
    'toast-top-right', 'toast-bottom-right', 'toast-bottom-center', 'toast-bottom-left', 'toast-center'];

  showToast(toasterService: NbToastrService, type: string, title: string, body: string) {
    var config;
    var timeoutvalue = 5000;
    var tapToDismissvalue = false;
    if (type == "error") {
      timeoutvalue = 60000;
      tapToDismissvalue = false;
    }
    toasterService.show(body,title);
  }
  validateAllFormFields(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach(field => {
      const control = formGroup.get(field);
      if (control instanceof FormControl) {
        control.markAsTouched({ onlySelf: true });

      } else if (control instanceof FormGroup) {
        this.validateAllFormFields(control);
      }
    });
  }
  getMetaData(data, modulename, type, subtype) {


    var availableOptions = [];
    var selectedOption = new Object();
    let promise = new Promise((resolve, reject) => {
      try {
        data.forEach(element => {

          if (element.SEMD_MODULE == modulename &&
            element.SEMD_SUB_MODULE == type &&
            element.SEMD_SUBTYPE == subtype) {
            var availableOptionsobj = {
              name: element.SEMD_VALUE,
              id: element.SEMD_CODE
            }
            availableOptions.push(availableOptionsobj);


            if (element.SEMD_DEFUALT == "Y") {
              selectedOption = {
                id: element.SEMD_CODE,
                name: element.SEMD_VALUE,
              }
            }
          }
        });
        var returndata = {
          "availableOptions": availableOptions,
          "selectedOption": selectedOption,
        }
        resolve(returndata);
      }
      catch (error) {
        reject(error);
      }
    });
    return promise;
  }
  extractMetaData(data, modulename, type, subtype) {

    let extracteddata = [];
    let returndata = [];
    let defualtValue;
    let promise = new Promise((resolve, reject) => {
      try {
        data.forEach(element => {
          if (element.SEMD_MODULE == modulename &&
            element.SEMD_SUB_MODULE == type &&
            element.SEMD_SUBTYPE == subtype) {
            extracteddata.push(element.SEMD_VALUE);
            if (element.SEMD_DEFUALT == "Y") {
              defualtValue = element.SEMD_VALUE;
            }
          }
        });
        returndata.push(extracteddata);
        returndata.push(defualtValue);
        resolve(returndata);
      }
      catch (error) {
        reject(error);
      }
    });
    return promise;
  }

  getTimeZone() {
    return "EST";
  }
  getReportFromDate() {
    return (new Date((new Date()).getTime() - 60 * 60 * 24 * 1000));
  }
  stringToDate(str) {
    var pattern = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/;
    var arrayDate = str.match(pattern);
    var dt = new Date(arrayDate[3], arrayDate[2] - 1, arrayDate[1]);
    return dt;
  }
  comp(a, b) {
      return new Date(b.STDT_DATE).getTime() - new Date(a.STDT_DATE).getTime();
  }
  checkModulepermission(module_path) {
    let promise = new Promise((resolve, reject) => {
      var formData = {
        module_path: module_path,
      };
      this.service.postData(environment.getModulePermission, formData).subscribe(
        (res: Res) => {
          if (res.return_code != 0) {

            resolve(false);
          }
          else {
            if (res.data.length == 0) {
              resolve(false);
            }
            else {
              if (res.data[0].PERMISSION == 0) {
                resolve(true);
              }
              else {
                resolve(false);
              }
            }
          }
        });

    });
    return promise;
  }
  sortDate = (direction: any, a: string, b: string): number => {
    let first = Number(new DatePipe('en-US').transform(a, 'yyyyMMdd'));
    let second = Number(new DatePipe('en-US').transform(b, 'yyyyMMdd'));

    if (first < second) {
      return -1 * direction;
    }
    if (first > second) {
      return direction;
    }
    return 0;
  }

  getDropdownMetaData(data, modulename, type, subtype) {
    var availableOptions = [];
    var selectedOption = new Object();
    let promise = new Promise((resolve, reject) => {
      try {
        data.forEach(element => {
          if (element.SEMD_MODULE == modulename &&
            element.SEMD_SUB_MODULE == type &&
            element.SEMD_SUBTYPE == subtype) {
            var availableOptionsobj = {
              value: element.SEMD_CODE,
              title: element.SEMD_VALUE,
            }
            availableOptions.push(availableOptionsobj);
            if (element.SEMD_DEFUALT == "Y") {
              selectedOption = {
                value: element.SEMD_CODE,
                title: element.SEMD_VALUE,
              }
            }
          }
        });
        var returndata = {
          "availableOptions": availableOptions,
          "selectedOption": selectedOption,
        }
        resolve(returndata);
      }
      catch (error) {
        reject(error);
      }
    });
    return promise;
  }

}