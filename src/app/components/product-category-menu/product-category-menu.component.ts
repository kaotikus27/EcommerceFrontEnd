import { Component, OnInit } from '@angular/core';
import { ProductCatergory } from 'src/app/common/product-catergory';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-category-menu',
  templateUrl: './product-category-menu.component.html',
  styleUrls: ['./product-category-menu.component.scss']
})
export class ProductCategoryMenuComponent implements OnInit {


  productCategories: ProductCatergory [] = [];



  constructor( private productService: ProductService ) { }

  ngOnInit(): void {
    this.ListProductCategories();
  }


  ListProductCategories() {

    this.productService.getProductCategories().subscribe(
      data=>{
        // console.log("product categories"+ JSON.stringify(data));
        this.productCategories = data;
      }
    );

  }

}
