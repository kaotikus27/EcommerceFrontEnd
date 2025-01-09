import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import {map } from 'rxjs/operators';
import { ProductCatergory } from '../common/product-catergory';

/* INTERFACES */
interface GetResponseProduct{
  _embedded:{
    products:Product[];
  }
}

interface GetResponseProductCategory{
  _embedded:{
    productCategory:ProductCatergory[];
  }
}

@Injectable({
  providedIn: 'root'
})

export class ProductService {
 

  // private baseUrl ="http://localhost:8080/api/products?size=100";
  private baseUrl ="http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category"

  constructor(
    private httpClient: HttpClient
  ) { }

  


  getProductList(theCategoryId:number): Observable<Product[]>{

    /* @TODO: need to build URL based on category id ... [DONE] */
    const searchUrl= `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;

    return this.getProducts(searchUrl);

  }


  searchProducts(theKeyword: string): Observable<Product[]> {

    /* @TODO: need to build URL based on findByNameContaining ... [DONE] */
    const searchUrl= `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;

    return this.getProducts(searchUrl);
    
  }

  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories():Observable<ProductCatergory[]> {

    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response=> response._embedded.productCategory)
    );

  }


  
}


