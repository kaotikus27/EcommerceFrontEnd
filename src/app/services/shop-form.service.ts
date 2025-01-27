import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { Country } from '../common/country';
import { State } from '../common/state';
import { environment } from 'src/environments/environment';


/* INTERFACES */
interface GetResponseCountries{
  _embedded:{
    countries:Country[];
  }
}
interface GetResponseStates{
  _embedded:{
    states: State[];
  }
}
/* END  INTERFACES */


@Injectable({
  providedIn: 'root'
})



export class ShopFormService {

  private countriesUrl= environment.EcommeceShopErul + '/countries';
  private stateUrl= environment.EcommeceShopErul +  '/states';

  constructor( 
    private httpClient: HttpClient

  ) {

   }

   /* getting the countries */
   getCountries(): Observable<Country[]>{
    return this.httpClient.get<GetResponseCountries>(this.countriesUrl).pipe(
      map(response=> response._embedded.countries)
    );
   }

   /* getting the states */
   getStates(theCountryCode:string):Observable<State[]>{
    const searchStatesUrl =`${this.stateUrl}/search/findByCountryCode?code=${theCountryCode}`;
    return this.httpClient.get<GetResponseStates>(searchStatesUrl).pipe(
      map(response => response._embedded.states)
    );

   }

   getCreditCardMonths(startMonth:number): Observable<number[]>{
    let data:number[]=[];
    /* build array for "MONTH" dropdown list */
    /* start at current motn and lopp until month 12 */
    for(let theMonth = startMonth; theMonth<=12; theMonth++){
      data.push(theMonth);
    }
    return of(data)
   }
   
   getCreditCardYears():Observable<number[]>{
    let data:number[]=[];
    /* build an array for "YEAR" downlist list */
    /* - start at current year and loop for the next 10 years */
    const startYear:number = new Date().getFullYear();
    const endYear:number = startYear +10;

    for( let theYear = startYear; theYear <= endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
   }

}
