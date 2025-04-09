import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { AddReviewComponent } from "../../reviews/add-review/add-review.component";
import { CartService } from '../../services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from '../../../core/services/auth.service';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-product-details',
  imports: [CommonModule, AddReviewComponent, NgxSkeletonLoaderModule, NgbCarouselModule],
  templateUrl: './product-details.component.html',
  styleUrl: './product-details.component.css'
})
export class ProductDetailsComponent {
  product: any;
  selectedSize: string | null = null;

  constructor(
    private route: ActivatedRoute, 
    private router: Router,
    private productService: ProductService,
    private cart: CartService,
    private toastr: ToastrService,
    private authService: AuthService
  ){}

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.getProductDetails(id);
    });
  }
  
  updateReviewCount(newCount: number) {
    this.product.numReviews = newCount;
  }

  getProductDetails(id: any){
    this.productService.getProductById(id).subscribe(
      (response) => {
        this.product = response.product;
      },
      (error) => {
        console.log(error);
      }
    );
  }

  addCartProduct(id: any) {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      this.toastr.warning('You need to Login first!');
      return;
    }
  
    if (!this.selectedSize) {
      this.toastr.warning('Pick your size please');
      return;
    }
  
    const addItem = {
      productId: id,
      quantity: 1,
      size: this.selectedSize
    };
  
    this.cart.AddToCart(addItem).subscribe(
      (response) => {
        console.log(response);
        this.toastr.success("Added to cart Successfully");
        this.router.navigate(['/cart']);
      },
      (error) => {
        console.log(error);
        this.toastr.error(error.error.error || "Something went wrong");
      }
    );
  }
  

}
