import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { TimelineComponent } from '../../../shared/components/timeline/timeline.component';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  imports: [TimelineComponent, CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {
  order: any = {};
  products: any[] = [];
  status: any
  fetchedProducts: any[] = []

  constructor(
    private orderService: OrderService, 
    private route: ActivatedRoute, 
    private productService: ProductService
  ){}

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id');
      this.GetOrderById(orderId)
    })

  }

  getFilteredItems(productId: string) {
      return this.order.items.filter((item: { productId: string; }) => item.productId === productId);
  }


  GetOrderById(orderId: any) {
    this.orderService.OrderById(orderId).subscribe(
      (response) => {
        this.order = response.order
        this.products = this.order.items
        console.log(this.order)

        this.fetchedProducts = [];
        this.order.items.forEach((item: { productId: string; productData?: any; }) => {
          this.productService.getProductById(item.productId).subscribe(
            (productData) => {
              item.productData = productData; 
              this.fetchedProducts.push(item.productData.product);
              console.log(this.fetchedProducts)
            },
            (error) => {
              console.error('Error fetching product details', error);
            }
          );
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }
  

}
