import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { Apollo } from 'apollo-angular';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {
  constructor(private apollo: Apollo) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');

    if (token) {
      return next.handle(this.injectToken(request));
    }
    return next.handle(request);
  }

  injectToken(request: HttpRequest<any>) {
    const token = localStorage.getItem('token');
    console.log('This is the token', token);
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }
}
