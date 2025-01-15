import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupName, Validators } from '@angular/forms';
import { Country } from 'src/app/common/country';
import { State } from 'src/app/common/state';
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
  
  

  constructor(
   
    private shopFormService:ShopFormService,
    private formBuilder:FormBuilder
  ) { }

  ngOnInit(): void {
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
        email:new FormControl('', 
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
        cardType:[''],
        nameOnCard:[''],
        cardNumber:[''],
        securityCode:[''],
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

    }

    console.log(this.checkoutFormGroup.get('customer')?.value)
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

  /* END ---- >  GETTER METHODS  */

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

}
