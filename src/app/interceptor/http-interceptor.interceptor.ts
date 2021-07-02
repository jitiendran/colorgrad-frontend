import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter, take, switchMap, mergeMap } from 'rxjs/operators';
import jwt_decode from 'jwt-decode';
import { Apollo, gql } from 'apollo-angular';

@Injectable()
export class HttpInterceptorInterceptor implements HttpInterceptor {
  constructor(private apollo: Apollo) {}

  private refreshTokenInProgress = false;
  private requestTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(
    null
  );

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    const token = localStorage.getItem('token');
    const refreshToken = localStorage.getItem('refreshToken');

    let decodedToken: any, apiName: any;

    if (token) {
      decodedToken = jwt_decode(token);
      let body: any = request.body;
      apiName = body ? body.operationName : '';

      console.log(decodedToken['exp'] - 120, new Date().getTime() / 1000);
      console.log(apiName);
    }

    if (apiName == 'refresh_token') {
      return next.handle(request);
    }

    if (
      decodedToken &&
      decodedToken['Expire'] &&
      decodedToken['Expire'] <= Date.now()
    ) {
      if (this.refreshTokenInProgress) {
        return this.requestTokenSubject.pipe(
          filter((token) => token != null),
          take(1),
          switchMap((token) => {
            return next.handle(this.injectToken(request));
          })
        );
      } else {
        console.log('Token Expired');
        this.refreshTokenInProgress = true;
        this.requestTokenSubject.next(null);

        const req = gql`
          mutation refresh_token($data: refresh_tokenInput!) {
            refresh_token(data: $data) {
              Token
              RefreshToken
            }
          }
        `;

        return this.apollo
          .mutate({
            mutation: req,
            variables: {
              data: {
                UserId: decodedToken['_id'],
                Username: decodedToken['Username'],
                RefreshToken: refreshToken,
              },
            },
          })
          .pipe(
            mergeMap(({ data }: any) => {
              if (data && data.refresh_token) {
                localStorage.setItem('token', data.refresh_token.Token);
                localStorage.setItem(
                  'refreshToken',
                  data.refresh_token.RefreshToken
                );
                this.requestTokenSubject.next(data.refresh_token.RefreshToken);
              }
              this.refreshTokenInProgress = false;
              return next.handle(this.injectToken(request));
            })
          );
      }
    } else {
      console.log('Not Expired');
      return next.handle(request);
    }
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
