import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PricePipe } from '../../../shared/pipes/price.pipe';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule, PricePipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: any[] = []

  constructor(private productService: ProductService){}

  ngOnInit(){
    this.getAllProducts()
  }

  getAllProducts(){
    this.productService.getAllProducts().subscribe(
      (response: any) => {
        this.products = response
        console.log(this.products)
      },
      (error) => {
        console.log(error)
      }
    )
  }

}
