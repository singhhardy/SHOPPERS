import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
  orders: any[] = []

  constructor(private orderService: OrderService, private productService: ProductService){}


  ngOnInit(){
    this.getMyOrders()
  }

  getMyOrders(): void {
    this.orderService.myOrders().subscribe(
      response => {
        this.orders = response;

        this.orders.forEach(order => {
          order.items.forEach((item: { productId: any; productData: any; }) => {
            this.productService.getProductById(item.productId).subscribe(
              productData => {
                item.productData = productData;
              },
              error => {
                console.error('Error fetching product details', error);
              }
            );
          });
        });
      },
      error => {
        console.error('Error fetching orders', error);
      }
    );
  }
}
