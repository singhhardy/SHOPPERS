import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-cart-page',
  imports: [ CommonModule, RouterModule ],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  cartItems: any[] = []
  cartTotal: any

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
        console.log(this.cartItems)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  removeItem(id: any){
    this.cart.removeItemFromCart(id).subscribe(
      response => {
        this.getCartItems()
      },
      error => {
        console.log(error)
      }
    )
  }

  CartTotal(){
    this.cart.getCartTotal().subscribe(
      (response) => {
        this.cartTotal = response.total
        console.log(this.cartTotal)
      },
      (error) => {
        console.log(error)
      }
    )
  }

  ClearCart(){
    this.cart.clearCart().subscribe(
      (response) => {
        this.toastr.success(response.message)
        this.getCartItems()
      },
      (error) =>  {
        this.toastr.error(error.message)
      }
    )
  }


  // Update cart
  addQuantity(productId: string) {
    const item = this.cartItems.find(item => item.productId._id === productId);
    if (item) {
      item.quantity += 1;
      this.calculateCartTotal()
      this.updateQuantity(productId, item.quantity);
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
        this.toastr.success('Item updated successfully');
      },
      (error) => {
        console.error('Error updating cart:', error);
        this.toastr.error('Failed to update cart');
      }
    );
  }

}
