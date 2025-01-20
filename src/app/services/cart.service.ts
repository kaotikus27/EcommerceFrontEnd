import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
 

  cartItems: CartItem[] = [];

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  /* only stay even refresh but if browser/tab is closed it dissapear */
  //storage:Storage = sessionStorage;
  storage:Storage = localStorage;


  constructor() {
    /* read data from storage */
    let data =  JSON.parse(this.storage.getItem('cartItems')!);
    
    if(data != null){
      this.cartItems = data;
      
      /* compute totals based on the data that is read from storage */
      this.computeCartTotals();
    }
   }

 

  decrementQuantity(theCartItem: CartItem) {
   theCartItem.quantity--;
   if(theCartItem.quantity ===0){
    this.remove(theCartItem);
   }else{
    this.computeCartTotals();
   }
  }

  remove(theCartItem: CartItem) {
    /* get the index of item in the array! */
    const intemIndex = this.cartItems.findIndex
    (tempCartItem => tempCartItem.id === theCartItem.id);

    /* if found, remove the item from the array at the given index */
    if(intemIndex>-1){
      this.cartItems.splice(intemIndex,1);
      this.computeCartTotals()
    }
  }

  addToCart(theCartItem: CartItem) {
    /* check if we already have item in our cart */
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem = undefined!;
    if (this.cartItems.length > 0) {
      /* find the item in the cart based on item id */
      /* BEFORE CODE | BASIC LOOP */
      /* for (let tempCartItem of this.cartItems) {
        if (tempCartItem.id === theCartItem.id) {
          existingCartItem = tempCartItem;
          break
        } 
      } */
     /* AFTER CODE | REFACTORING */
     existingCartItem = this.cartItems.find(
      tempcartItem => tempcartItem.id === theCartItem.id)!;

      /* check if we found it */
      alreadyExistsInCart = (existingCartItem != undefined);
    }
    if(alreadyExistsInCart){
      /* increement the quantity */
      existingCartItem.quantity++;
    }else{
      /* just add the item to the array */
      this.cartItems.push(theCartItem);
    }

    /* compute cart the total price and total quantity */
    this.computeCartTotals();

  }

  computeCartTotals() {
   let totalPriceValue:number =0;
   let totalQuantityValue:number = 0;

   for(let currentCartItem of this.cartItems){
    totalPriceValue += currentCartItem.quantity * currentCartItem.unitPrice;
    totalQuantityValue += currentCartItem.quantity;
   }

   /* publish the new value... all subscribers will receive new data */
   this.totalPrice.next(totalPriceValue);
   this.totalQuantity.next(totalQuantityValue);

   /* log cart data */
   this.logCartData(totalPriceValue, totalQuantityValue);

   /* persis cart data */

   this.persistCartItems();

  }

  persistCartItems(){
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems));
   }

  logCartData(totalPriceValue: number, totalQuantityValue: number) {
   
    console.log('content of the cart');
    for(let tempCartItem of this.cartItems){
      const subTotalPrice = tempCartItem.unitPrice* tempCartItem.quantity;
      console.log(`name:${tempCartItem.name}, 
                  quantity=${tempCartItem.quantity}, 
                  unitPrice=${tempCartItem.unitPrice}, 
                  subTotalPrice=${subTotalPrice}`);
    }
    console.log(`totlaPrice: ${totalPriceValue.toFixed(2)}`);
    console.log(`total quantity:${totalQuantityValue}`)
  }

}
