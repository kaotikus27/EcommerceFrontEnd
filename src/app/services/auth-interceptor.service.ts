import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { from, lastValueFrom, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(@Inject (OKTA_AUTH) private oktaAuth:OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    return from(this.handleAccess(request, next));
    
  }

  private async handleAccess(request: HttpRequest<any>, next: HttpHandler):Promise<HttpEvent<any>>{
    
    /* only add an access token for sercure endpoints */
    const securedEndpoints = ['http://localhost:8080/api/orders'];

    
    if(securedEndpoints.some(url => request.urlWithParams.includes(url))){

      /* get access token */
      const accesToken = this.oktaAuth.getAccessToken();

      /* clone the request and add new header with access token */

      request = request.clone({
        setHeaders: {
          Authorization: 'Bearer' + accesToken
        }
      });



    }

    return await lastValueFrom(next.handle(request));
  }
}
