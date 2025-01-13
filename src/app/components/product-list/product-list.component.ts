import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {



  products: Product[]=[];
  currentCategoryId:number = 1 ;
  previousCategoryId:number = 1 ;
  searchMode:boolean = false;

  /* new properties for pagination */
  thePageNumber:number = 1;
  thePageSize:number =5;
  theTotalElements:number = 0;


  previousKeyword: string = "";

  constructor( 
    private cartService:CartService,
    private productService: ProductService, 
    private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.ListProducts();
    });
  
  }


  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.ListProducts();
    }



 ListProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProduct();

    }else{
      this.handleListProduct();
    }
    
  }

  handleSearchProduct() {

    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

   /* if we have different keyword than previous then set thePageNumber to 1 */
    if(this.previousKeyword !=theKeyword){
      this.thePageNumber=1;
    }
    this.previousKeyword = theKeyword;
    
    console.log(`keyword=${theKeyword}, thePageNubmer=${this.thePageNumber}` );

    /* search for the product using the keyword */
    /* this.productService.searchProducts(theKeyword).subscribe(
      data=>{
        this.products = data;
      }
    ) */
    /* updated code for pagination */
    this.productService.searchProductsPaginate(this.thePageNumber -1,
                                               this.thePageSize,
                                               theKeyword).subscribe(this.processResult());
  }
  

  handleListProduct(){
    /* check if "id" parameter is available */
    const hasCategoryId: boolean = this.route.snapshot.paramMap.has('id');

    if(hasCategoryId){
      /* get the "id" param string. convert string to a number using the "+" sysmbol */
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;
    }else{
      /* category id not available ... setting default to category id 1 */
      this.currentCategoryId = 1;
    }


    /*
    Check if we have different catergory than previous
    Note: Angular will reuse a component if it is currently being viewed
    
    If we have a different category id than previous then set thePageNumber back to 1
    */

    if(this.previousCategoryId != this.currentCategoryId){
      this.thePageNumber =1;
    }

    this.previousCategoryId = this.currentCategoryId;
    console.log(`currentCategoryId=${this.currentCategoryId}, 
                  thePageNumber=${this.thePageNumber}`);

    /* getting the product for the given category id */
    /* this.productService.getProductList(this.currentCategoryId).subscribe(
      data=>{
        this.products= data;
        console.log(data)
      }
    ) */

      /* -1 because Spring Data REST: pages are 0 based */
      this.productService.getProductListPaginate(
        this.thePageNumber -1,
        this.thePageSize,
        this.currentCategoryId)
        .subscribe(this.processResult());

  }


  /* searchProductsPaginate */
  processResult(){
   return (data: any)=>{
    this.products = data._embedded.products;
    this.thePageNumber = data.page.number +1;
    this.thePageSize = data.page.size;
    this.theTotalElements = data.page.totalElemets;
   }
  }

  addToCart(theProduct: Product){
    console.log(`adding to cart: ${theProduct.name}, ${theProduct.unitPrice}`)

    const theCartItem = new CartItem(theProduct);

    this.cartService.addToCart(theCartItem);
  }

}
