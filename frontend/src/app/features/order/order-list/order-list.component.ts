import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, FormsModule, NgxSkeletonLoaderModule, RouterModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
  orders: any[] = []
  filteredOrders: any[] = [];
  isLoading: boolean = true

  filters = {
    confirmed: false,
    cancelled: false,
    pending: false,
    delivered: false
  };

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
                this.applyFilters(); 
                this.isLoading = false
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

  applyFilters(): void {
    const activeFilters = Object.keys(this.filters).filter(key => (this.filters as any)[key]);
  
    if (activeFilters.length === 0) {
      this.filteredOrders = [...this.orders];
    } else {
      this.filteredOrders = this.orders.filter(order => 
        activeFilters.includes(order.status.toLowerCase())
      );
    }
  }
  
}
