import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CommonModule } from '@angular/common';
import { ProductService } from '../../services/product.service';
import { FormsModule } from '@angular/forms';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { RouterModule } from '@angular/router';
import { PricePipe } from '../../../shared/pipes/price.pipe';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, FormsModule, NgxSkeletonLoaderModule, RouterModule, PricePipe],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent {
  orders: any[] = []
  filteredOrders: any[] = [];
  isLoading: boolean = true

  currentPage = 1;
  totalPages = 0;
  pageSize = 5;

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
    this.isLoading = true;
    this.orderService.myOrders(this.currentPage, this.pageSize).subscribe(
      response => {
        this.orders = response.orders;
        this.totalPages = response.pages; 
        if (Array.isArray(this.orders)) {
          let productFetches: any[] = [];
  
          this.orders.forEach(order => {
            order.items.forEach((item: {
              productData: any; productId: any; }) => {
              const fetch = this.productService.getProductById(item.productId).toPromise().then(
                productData => item.productData = productData,
                error => console.error('Error fetching product details', error)
              );
              productFetches.push(fetch);
            });
          });
  
          Promise.all(productFetches).then(() => {
            this.applyFilters();
            this.isLoading = false;
          });
        } else {
          console.error('Orders is not an array', this.orders);
          this.isLoading = false;
        }
      },
      error => {
        console.error('Error fetching orders', error);
        this.isLoading = false;
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

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.currentPage = page;
      this.getMyOrders();
    }
  }

  
}
