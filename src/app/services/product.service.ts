import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Product } from '../common/product';
import { map } from 'rxjs/operators';
import { ProductCatergory } from '../common/product-catergory';

/* INTERFACES */
interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page:
  {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }
}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCatergory[];
  }
}

/* end INTERFACES */

@Injectable({
  providedIn: 'root'
})

export class ProductService {

  // private baseUrl ="http://localhost:8080/api/products?size=100";
  private baseUrl = "http://localhost:8080/api/products";
  private categoryUrl = "http://localhost:8080/api/product-category"

  constructor(
    private httpClient: HttpClient
  ) { }


  getProduct(theProductId: number): Observable<Product> {
    /* build URL based on product id */
    const productUrl = `${this.baseUrl}/${theProductId}`;
    return this.httpClient.get<Product>(productUrl);

  }

  
  getProductList(theCategoryId: number): Observable<Product[]> {
    /* URL based on category id, */
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`;
    return this.getProducts(searchUrl);

  }

  
  getProductListPaginate(thePage: number,
                         thePagesize: number,
                         theCategoryId: number): Observable<GetResponseProduct> {
    /* URL based on category id, page and size */
    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePagesize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }


  searchProducts(theKeyword: string): Observable<Product[]> {
    /* URL based on the keyword */
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`;
    return this.getProducts(searchUrl);
  }


  /* support pagination */
  searchProductsPaginate(thePage: number,
                         thePagesize: number,
                         theKeyword: string): Observable<GetResponseProduct> {
                          
    /* URL based on the keyword, page and size */
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
                      + `&page=${thePage}&size=${thePagesize}`;

    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  /* the refractor method used in searchProducts and getProductList */
  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  getProductCategories(): Observable<ProductCatergory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );

  }



}


