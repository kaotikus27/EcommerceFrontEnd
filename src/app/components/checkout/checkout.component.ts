import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ShopFormService } from 'src/app/services/shop-form.service';

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
  

  constructor(
    private shopFormService:ShopFormService,
    private formBuilder:FormBuilder
  ) { }

  ngOnInit(): void {
    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName:[''],
        lastName:[''],
        email:['']
      }),
      shippingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:['']
      }),
      billingAddress: this.formBuilder.group({
        street:[''],
        city:[''],
        state:[''],
        country:[''],
        zipCode:['']
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


  }

  onSubmit(){
    console.log("submission")
    console.log(this.checkoutFormGroup.get('customer')?.value)
  }


  copyShippingAddressToBillingAddress(event:any) {
      if(event.target.checked){
        this.checkoutFormGroup.controls['billingAddress']
        .setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      }else{
        this.checkoutFormGroup.controls['billingAddress'].reset();
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
