import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-cart-page',
  imports: [ CommonModule, RouterModule, NgxSkeletonLoaderModule ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  cartItems: any[] = []
  cartTotal: any
  isLoading: boolean = true;

  constructor(private cart: CartService, private toastr: ToastrService){}

  ngOnInit(){
    this.getCartItems()
    this.CartTotal()
  }

  calculateCartTotal() {
    this.cartTotal = this.cartItems.reduce((total, item) => {
      return total + item.productId.price * item.quantity;
    }, 0);
  }
  

  getCartItems(){
    this.cart.getMyCart().subscribe(
      (response) => {
        this.cartItems = response.cart.items
        this.cart.updateCartItemCount(this.cartItems.length);
        this.isLoading = false
      }
    )
  }

  removeItem(id: any){
    this.cart.removeItemFromCart(id).subscribe(
      response => {
        this.getCartItems()
      }
    )
  }

  CartTotal(){
    this.cart.getCartTotal().subscribe(
      (response) => {
        this.cartTotal = response.total
        console.log(this.cartTotal)
      }
    )
  }

  ClearCart(){
    this.cart.clearCart().subscribe(
      (response) => {
        this.toastr.success(response.message)
        this.getCartItems()
      }
    )
  }


  // Update cart
  addQuantity(productId: string) {
    const item = this.cartItems.find(item => item.productId._id === productId);
    if (item) {
      if (item.quantity >= item.productId.countInStock) {
        this.toastr.warning('Not enough stock available');
        return;
      }
      const newQuantity = item.quantity + 1;
      item.quantity = newQuantity;
      this.calculateCartTotal();
      this.updateQuantity(productId, newQuantity);
    }
  }

  decQuantity(productId: string) {
    const item = this.cartItems.find(item => item.productId._id === productId);
    if (item && item.quantity > 1) {
      item.quantity -= 1;
      this.calculateCartTotal()
      this.updateQuantity(productId, item.quantity);
    }
  }

  updateQuantity(productId: string, quantity: number) {
    const cartData = { productId, quantity };

    this.cart.updateCart(cartData).subscribe(
      (response) => {
        console.log('Cart updated:', response);
        this.getCartItems()
        this.cartTotal
        // this.toastr.success('Item updated successfully');
      },
      (error) => {
        const item = this.cartItems.find(item => item.productId._id === productId);
        if (item) {
          item.quantity = quantity - 1;
          this.calculateCartTotal();
        }
      }
    );
  }

}
