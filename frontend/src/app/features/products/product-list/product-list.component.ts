import { Component } from '@angular/core';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { PricePipe } from '../../../shared/pipes/price.pipe';
import { HttpClient } from '@angular/common/http';
import { NgxPaginationModule } from 'ngx-pagination';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  imports: [CommonModule, RouterModule, NgxSkeletonLoaderModule, PricePipe, NgxPaginationModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css'
})
export class ProductListComponent {
  loading = false
  products: any[] = [];
  currentPage = 1;
  totalPages = 0;
  limit = 10;
  searchText = '';
  showFilters: boolean = true;

  // FILTERS
  categories = ['Shoes', 'T-shirts', 'Shirts', 'Hoodies']
  selectedCategory: string = ''
  priceRanges = [
    { label: '₹0 – ₹500', min: 0, max: 500 },
    { label: '₹500 – ₹1000', min: 500, max: 1000 },
    { label: '₹1000 – ₹5000', min: 1000, max: 5000 },
    { label: '₹5000 – ₹10000', min: 5000, max: 10000 },
    { label: '₹10000+', min: 10000, max: 1000000 }
  ];
  selectedPriceRange: { min: number; max: number } | null = null;
  brands: string[] = ['Nike', 'Puma', 'Adidas', 'New Balance', 'Reebok']
  selectedBrand: string = '';
  selectedRating: number | null = null;
  selectedSort: string = ''
  
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
      this.checkScreenSize()
    });
  }

  checkScreenSize() {
    const width = window.innerWidth;
    this.showFilters = width >= 992;
  }

  loadProducts() {
    const minPrice = this.selectedPriceRange?.min
    const maxPrice = this.selectedPriceRange?.max

    this.productService.searchProducts(
      this.searchText, 
      this.currentPage, 
      this.limit, 
      this.selectedCategory,
      minPrice,
      maxPrice,
      this.selectedBrand,
      this.selectedRating,
      this.selectedSort
    ).subscribe(
      (res: any) => {
        this.products = res.results;
        this.totalPages = Math.ceil(res.total / this.limit);
      },
      (error) => {
        console.error('Error loading products:', error);
      }
    );
  }

  resetFilters(){
    this.selectedCategory = ''
    this.selectedBrand = ''
    this.selectedPriceRange = null
    this.selectedRating = null;
    this.selectedSort = '';
    this.currentPage = 1;
    this.searchText = '';
    this.loadProducts();
  }

  onPriceRangeSelect(range: { min: number; max: number }) {
    this.selectedPriceRange = range;
    this.loadProducts();
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
