import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpParams, HttpHeaders } from "@angular/common/http";
import { Observable } from "rxjs/Observable";
import { Injectable, Injector, Inject } from '@angular/core';

import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { catchError, finalize, map, switchMap } from 'rxjs/operators';
import 'rxjs/add/observable/throw';
import { NbAuthToken, NbAuthService, NB_AUTH_TOKEN_INTERCEPTOR_FILTER } from '@nebular/auth';
@Injectable()
export class HTTPStatus {
  private requestInFlight$: BehaviorSubject<boolean>;
  constructor() {
    this.requestInFlight$ = new BehaviorSubject(false);
  }

  setHttpStatus(inFlight: boolean) {
    this.requestInFlight$.next(inFlight);
  }

  getHttpStatus(): Observable<boolean> {
    return this.requestInFlight$.asObservable();
  }
}

@Injectable()
export class HTTPListener implements HttpInterceptor {
  constructor(private status: HTTPStatus) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      map(event => {
        return event;
      }),
      catchError(error => {
        return Observable.throw(error);
      }),
      finalize(() => {
        this.status.setHttpStatus(false);
      })
    )
  }
}

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(private injector: Injector,
              @Inject(NB_AUTH_TOKEN_INTERCEPTOR_FILTER) protected filter) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      if (!this.filter(req)) {
        return this.authService.isAuthenticatedOrRefresh()
          .pipe(
            switchMap(authenticated => {
              if (authenticated) {
                  return this.authService.getToken().pipe(
                    switchMap((token: NbAuthToken) => {
                      const JWT = `Bearer ${token.getValue()}`;
                      req = req.clone({
                        setHeaders: {
                          Authorization: JWT,
                        },
                      });
                      return next.handle(req);
                    }),
                  )
              } else {
                return next.handle(req);
              }
            }),
          )
      } else {
      return next.handle(req);
    }
  }

  protected get authService(): NbAuthService {
    return this.injector.get(NbAuthService);
  }

}