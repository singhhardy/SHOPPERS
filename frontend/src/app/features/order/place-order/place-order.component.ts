import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AddnewAddressComponent } from "../../user/user-address/addnew-address/addnew-address.component";
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [CommonModule, AddnewAddressComponent],
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.css'
})
export class PlaceOrderComponent {
  currentStep = 1;
  addresses: any = [];
  selectedAddressId: string = '';
  paymentMethod: string = 'COD';
  cartItems: any[] = []

  constructor(
    private userService: UserService,
    private cart: CartService,
    private toastr: ToastrService,
    private orderService: OrderService
  ){}

  ngOnInit(){
    this.getAddresses()
    this.getCartItems()
  }

  getAddresses(){
    this.userService.addresses$.subscribe((addresses) => {
      this.addresses = addresses || [];
    });
    this.userService.fetchAddresses();
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

  onAddressChange(id: string) {
    this.selectedAddressId = id;
    console.log(this.selectedAddressId)
  }

  confirmOrder(): void {
    const OrderData = {
      addressId: this.selectedAddressId,
      paymentMethod: this.paymentMethod
    }

    this.orderService.placeOrder(OrderData).subscribe(
      (response) => {
        console.log(response)
        this.toastr.success(response.message)
      },
      (error) => {
        this.toastr.error(error.message)
        console.log(error)
      }
    )
  }

}
