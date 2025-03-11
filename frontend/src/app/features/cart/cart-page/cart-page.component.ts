import { Component } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cart-page',
  imports: [CommonModule],
  templateUrl: './cart-page.component.html',
  styleUrl: './cart-page.component.css'
})
export class CartPageComponent {
  cartItems: any[] = []

  constructor(private cart: CartService){}

  ngOnInit(){
    this.getCartItems()
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
    console.log(id)
    this.cart.removeItemFromCart(id).subscribe(
      response => {
        console.log(response)
        this.getCartItems()
      },
      error => {
        console.log(error)
      }
    )
  }

}
