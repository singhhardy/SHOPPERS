import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule, PricePipe, NgxPaginationModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  products: any[] = [];
  currentPage = 1;
  totalPages = 0;
  limit = 10;
  searchText = '';

  constructor(
    private productService: ProductService,
    private http: HttpClient,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      this.searchText = params['q'] || '';
      this.currentPage = +params['page'] || 1;
      this.loadProducts();
    });
  }

  loadProducts() {
    this.productService.searchProducts(this.searchText, this.currentPage, this.limit).subscribe(
      (res: any) => {
        this.products = res.results;
        this.totalPages = Math.ceil(res.total / this.limit);
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  changePage(page: number): void {
    if (page > 0 && page <= this.totalPages) {
      this.router.navigate([], {
        queryParams: {
          q: this.searchText,
          page: page
        },
        queryParamsHandling: 'merge'
      });
    }
  }
}
