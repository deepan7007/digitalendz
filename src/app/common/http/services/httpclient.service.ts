
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/catch';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/map';
import { Filter } from '../Models/filter.model';
import * as jwtDecode from 'jwt-decode';
import { Router } from "@angular/router"

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class HttpClientService {

  constructor(private http: HttpClient, private router: Router) { }

  // Uses http.get() to load data from a single API endpoint
  getData(url: string) {


    return this.http.get(url)
      .map(
        (data) => {
          return data;
        })
      .catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        return Observable.throw(this.handleError(err));

      });
  }
  getDatawithFilters(url: string, filters: Filter[]) {
    let params = new HttpParams();
    filters.forEach(filter => {
      params = params.append(filter.name, filter.value);
    });

    return this.http.get(url, { params: params })
      .map(
        (data) => {
          return data;
        })
      .catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        return Observable.throw(this.handleError(err));

      });
  }
  postData(url: string, formdata: any) {
    return this.http.post(url, formdata)
      .map(
        (data) => {
          return data;
        })
      .catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        return Observable.throw(this.handleError(err));

      });
  }
  donwloadFile(url: string, formdata: any) {
    return this.http.post(url, formdata, {
      responseType: "blob",
      headers: new HttpHeaders().append("Content-Type", "application/json")
    })
      .map(
        (data) => {
          return data;
        })
      .catch((err: HttpErrorResponse) => {
        // simple logging, but you can do a lot more, see below
        return Observable.throw(this.handleError(err));

      });
  }


  // Uses Observable.forkJoin() to run multiple concurrent http.get() requests.
  // The entire operation will result in an error state if any single request fails.
  postDataMultiple(serviceData: any[]) {
    const calls = [];
    serviceData.forEach(element => {
      calls.push(this.http.post(element.url, element.formdata));
    });
    return Observable.forkJoin(calls);
  }
  private handleError(err: HttpErrorResponse) {
    // in a real world app, we may send the server to some remote logging infrastructure
    // instead of just logging it to the console
    let errorMessage = '';
    if (err.error instanceof Error) {
      // A client-side or network error occurred. Handle it accordingly.
      errorMessage = `An error occurred: ${err.error.message}`;
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;
    }
    this.router.navigate(['/auth/login'])
    return Observable.throw(errorMessage);
  }

  public decodeToken(token: string) {
    return jwtDecode(token);
  }

}
