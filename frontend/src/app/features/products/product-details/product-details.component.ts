import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-product-details',
  imports: [],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  product: any

  constructor(private route: ActivatedRoute, private productService: ProductService){}

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.getProductDetails(id); // Pass id directly here
    });
  }
  
  getProductDetails(id: any){
    this.productService.getProductById(id).subscribe(
      (response) => {
        this.product = response.product;
        console.log(this.product);
      },
      (error) => {
        console.log(error);
      }
    );
  }
}
