import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { OrderHistory } from '../common/order-history';
import { environment } from 'src/environments/environment';

/* INTERFACES */

interface GetResponseOrderHistory{
  _embedded:{
    orders: OrderHistory[];
  }
}

/* END OF INTERFACES */

@Injectable({
  providedIn: 'root'
})
export class OrderHistoryService {

  private orderUrl = environment.EcommeceShopErul + '/orders';


  constructor(
    private httpClient: HttpClient
  ) { }


  getOrderHistory(theEmail: string): Observable<GetResponseOrderHistory>{

    /* build URL based on the customer email */
    const OrderHistoryUrl = 
    `${this.orderUrl}/search/findByCustomerEmailOrderByDateCreatedDesc?email=${theEmail}`;

    return this.httpClient.get<GetResponseOrderHistory>(OrderHistoryUrl);

  }

}
