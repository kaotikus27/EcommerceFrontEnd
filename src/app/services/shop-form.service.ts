import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopFormService {

  constructor() {

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

    for( let theYear = startYear; theYear <=endYear; theYear++){
      data.push(theYear);
    }
    return of(data);
   }

}
