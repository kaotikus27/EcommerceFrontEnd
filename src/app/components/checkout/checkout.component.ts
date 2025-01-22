import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutService } from 'src/app/services/checkout.service';
import { ShopFormService } from 'src/app/services/shop-form.service';
import { ShopValidators } from 'src/app/validators/shop-validators';

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.scss']
})
export class CheckoutComponent implements OnInit {


  checkoutFormGroup!: FormGroup;
  totalPrice:number = 0;
  totalQuantity:number = 0;

  creditCardYears: number []=[];
  creditCardMonths: number []=[];

  countries:Country []=[];

  shippingAddressStates: State[]=[];
  billingAddressStates: State[]=[];
  
  storage: Storage = sessionStorage;

  constructor(
    private checkoutService:CheckoutService,
    private router:Router,
    private cartService:CartService,
     private shopFormService:ShopFormService,
    private formBuilder:FormBuilder
  ) { }

  ngOnInit(): void {

    this.reviewCardDetails();
    
    /* reading the user's email address from the browser storage */

    const theEmail = JSON.parse(this.storage.getItem('userEmail')!);



    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName:new FormControl('',
            [ 
              Validators.required, 
              Validators.minLength(2) , 
              ShopValidators.notOnlyWhitespace
            ]),
        lastName:new FormControl('',
          [
           Validators.required, 
           Validators.minLength(2), 
           ShopValidators.notOnlyWhitespace
          ]),
        email:new FormControl(theEmail, 
            [
              Validators.required,
              Validators.pattern('^[a-zA-Z0-9_.±]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')
            ]
        )
      }),

      shippingAddress: this.formBuilder.group({
        street:
        new FormControl('',
          [
           Validators.required,Validators.minLength(2), 
           ShopValidators.notOnlyWhitespace
          ]), 
        city: new FormControl('',
          [
           Validators.required,Validators.minLength(2), 
           ShopValidators.notOnlyWhitespace
          ]),
        state:  new FormControl('', [Validators.required ]),
        country:new FormControl('', [Validators.required ]),
        zipCode: new FormControl('',
          [
           Validators.required,Validators.minLength(2), 
           ShopValidators.notOnlyWhitespace
          ])
      }),

      billingAddress: this.formBuilder.group({
        street:
        new FormControl('',
          [
           Validators.required,Validators.minLength(2), 
           ShopValidators.notOnlyWhitespace
          ]),
        city: new FormControl('',
          [
           Validators.required,Validators.minLength(2), 
           ShopValidators.notOnlyWhitespace
          ]),
        state:  new FormControl('', [Validators.required ]),
        country:new FormControl('', [Validators.required ]),
        zipCode: new FormControl('',
          [
           Validators.required,Validators.minLength(2), 
           ShopValidators.notOnlyWhitespace
          ])
      }),

      creditCard: this.formBuilder.group({
        cardType:new FormControl('', [Validators.required ]),
        nameOnCard:new FormControl('', [Validators.required, Validators.minLength(2),ShopValidators.notOnlyWhitespace ]),
        cardNumber:new FormControl('', [Validators.required,Validators.pattern('[0-9]{16}', )]),
        securityCode:new FormControl('', [Validators.required ,Validators.pattern('[0-9]{3}')]),
        expirationMonth:[''],
        expirationYear:['']
      })
    });

    /* creditcard months */
    const startMonth:number= new Date().getMonth() + 1;
    console.log("startMonth: "+startMonth);
    this.shopFormService.getCreditCardMonths(startMonth).subscribe(
      data =>{
        console.log("retrieved credit card months: "+ JSON.stringify(data));
        this.creditCardMonths = data;
      }
    )

    /* creditcard Years */
   this.shopFormService.getCreditCardYears().subscribe(
    data =>{
      console.log("retrieved credit card months: "+ JSON.stringify(data));
      this.creditCardYears = data;
    }
   )

   /* populate countries */
   this.shopFormService.getCountries().subscribe(
    data=> {
      console.log("Retrieved countries: " + JSON.stringify(data))
      this.countries = data;
    }
   )

  }



  reviewCardDetails() {
    /* subscribe to cartService.totalQuanty */
    this.cartService.totalQuantity.subscribe(
      totalQuantity => this.totalQuantity = totalQuantity
    );


    /* subscribe to cartService.totalPrice */
    this.cartService.totalPrice.subscribe(
      totalPrice => this.totalPrice = totalPrice
    );
  }


  /* populate  state method */
  getStates(formGroupName:string){
    const formGroup = this.checkoutFormGroup.get(formGroupName);
    
    const countryCode = formGroup?.value.country.code;
    const countryName = formGroup?.value.country.name;

    console.log(`${formGroupName} country code: ${countryCode}` );
    console.log(`${formGroupName} country name: ${countryName}` );

    this.shopFormService.getStates(countryCode).subscribe(
      data=>{
        if(formGroupName === 'shippingAddress' ){
          this.shippingAddressStates =data
        }else{
          this.billingAddressStates = data
        }

        /* select the first item by default */
        formGroup!.get('state')!.setValue(data[0])!;
      }
    );

   }
 

  onSubmit(){
    console.log("submission")
    if(this.checkoutFormGroup.invalid){
      /* markAllAsTouched() os angular builtIn method fo 
      touching all fields triggers the display of the rror messages */
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }
    console.log(this.checkoutFormGroup.get('customer')?.value)

    /* setup order */
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;


    /* get cart Items */
    const cartItems= this.cartService.cartItems;

    /* create orderItems from cartItems */
    /* LONG WAY TO LOOP */
    /* let orderItems: OrderItem[] = [];
    for (let i = 0; i < cartItems.length; i++) {
      orderItems[i] = new Order(cartItems[i]);
    } */ 
    /* SHORT WAY TO LOOP */
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    /* setup purchase */
    let purchase = new Purchase();

    /* populate purchase - customer */
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;

    /* populate purchase - shipping address */
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    purchase.shippingAddress.state= shippingState.name;
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.country = shippingCountry.name

    /* populate purcase - billing address */
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAddress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    purchase.billingAddress.state= billingState.name;
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.country = billingCountry.name

    /* populate purchase - order and orderitems */
    purchase.order= order;
    purchase.orderItems = orderItems;

    /* call REST API via the checkoutService */
    this.checkoutService.placeOrder(purchase).subscribe(
      {
        next: response =>{
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);
          
          /* reset cart */
          this.resetCart();
        },
        error: err=>{
          alert(`There was an error: ${err.message}`);
        }
      }
    );
  }

  resetCart() {
    /* reset cart */
    this.cartService.cartItems = [];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    /* reset the form  */
    this.checkoutFormGroup.reset();

    /* navigate back to main product page */
    this.router.navigateByUrl("/products");


  }

  copyShippingAddressToBillingAddress(event:any) {
      if(event.target.checked){
        this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
        this.billingAddressStates = this.shippingAddressStates;
      }else{
        this.checkoutFormGroup.controls['billingAddress'].reset();

        this.billingAddressStates= [];
        
      }
    }


    
    handleMonthsAndYears(){
      const creditcardFormGroup = this.checkoutFormGroup.get('creditCard');
      const currentYear:number = new Date().getFullYear();
      const selectedYear:number = Number(creditcardFormGroup?.value.expirationYear);

      let startMonth:number;

      if(currentYear == selectedYear){
        startMonth = new Date().getMonth() +1;
      }else {
        startMonth = 1;
      }

      this.shopFormService.getCreditCardMonths(startMonth).subscribe(
        data =>{
          console.log("retrieved credit card months: " +JSON.stringify(data));
          this.creditCardMonths = data;
        }
      )

    }


    /* GETTER METHODS  */
  get firstName(){return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){return this.checkoutFormGroup.get('customer.lastName'); }
  get email(){return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressStreet(){return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(){return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState(){return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressCountry(){return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressZipCode(){return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAddressStreet(){return this.checkoutFormGroup.get('billingAddress.street'); }
  get billingAddressCity(){return this.checkoutFormGroup.get('billingAddress.city'); }
  get billingAddressState(){return this.checkoutFormGroup.get('billingAddress.state'); }
  get billingAddressCountry(){return this.checkoutFormGroup.get('billingAddress.country'); }
  get billingAddressZipCode(){return this.checkoutFormGroup.get('billingAddress.zipCode'); }

  get creditCardType(){return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNameOnCard(){return this.checkoutFormGroup.get('creditCard.nameOnCard'); }
  get creditCardnumber(){return this.checkoutFormGroup.get('creditCard.cardnumber'); }
  get creditNumber(){return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditSecurityCode(){return this.checkoutFormGroup.get('creditCard.securityCode'); }

  /* END ---- >  GETTER METHODS  */

}
