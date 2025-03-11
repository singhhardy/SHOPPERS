import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';
import { response } from 'express';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule],
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

}
