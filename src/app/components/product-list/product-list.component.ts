import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Product } from 'src/app/common/product';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list-grid.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit {


  products: Product[]=[];
  currentCategoryId:number = 1 ;
  searchMode:boolean = false;

  constructor( 
    private productService: ProductService, 
    private route: ActivatedRoute ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(()=>{
      this.listProducts();
    });
  
  }

 listProducts(){
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if(this.searchMode){
      this.handleSearchProduct();

    }else{
      this.handleListProduct();
    }
    
  }

  handleSearchProduct() {
    const theKeyword: string = this.route.snapshot.paramMap.get('keyword')!;

    /* search for the product using the keyword */
    this.productService.searchProducts(theKeyword).subscribe(
      data=>{
        this.products = data;
      }
    )
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

    /* getting the product for the given category id */
    this.productService.getProductList(this.currentCategoryId).subscribe(
      data=>{
        this.products= data;
        console.log(data)
      }
    )
  }

}
