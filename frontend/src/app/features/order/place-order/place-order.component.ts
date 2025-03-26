import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AddnewAddressComponent } from "../../user/user-address/addnew-address/addnew-address.component";
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [CommonModule, AddnewAddressComponent, FormsModule],
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.css'
})
export class PlaceOrderComponent {
  currentStep = 1;
  addresses: any = [];
  selectedAddressId: string = '';
  paymentMethod: string = '';
  cartItems: any[] = []

  constructor(
    private userService: UserService,
    private cart: CartService,
    private toastr: ToastrService,
    private orderService: OrderService,
    private ngZone: NgZone
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
    console.log('Razorpay:', (window as any).Razorpay);
  
    const OrderData = {
      addressId: this.selectedAddressId,
      paymentMethod: this.paymentMethod
    };
  
    console.log("Placing order with data:", OrderData);
  
    this.orderService.placeOrder(OrderData).subscribe(
      (response) => {
        if (this.paymentMethod === "Razorpay" && response.success) {
          const internalOrderId = response.internalOrderId;
          console.log("Received internalOrderId:", internalOrderId);
  
          const options = {
            key: response.key,
            amount: response.totalAmount * 100,
            currency: "INR",
            name: "SHOPPERS",
            description: "Test Transaction",
            order_id: response.razorpayOrderId,
            handler: (paymentResponse: any) => {
              paymentResponse.internalOrderId = internalOrderId;
              console.log("Payment successful, paymentResponse:", paymentResponse);
              this.ngZone.run(() => {
                this.verifyPayment(paymentResponse);
              });
            },
            prefill: {
              name: "Test User",
              email: "test@example.com",
              contact: "9999999999"
            },
            notes: {
              address: "Razorpay Corporate Office"
            },
            theme: {
              color: "#3399cc"
            }
          };
  
          const razorpay = new (window as any).Razorpay(options);
          razorpay.open();
  
          razorpay.on("payment.failed", (response: any) => {
            console.error("Payment failed", response);
            this.toastr.error("Payment failed. Try again.");
          });
        } else {
          this.toastr.success(response.message);
        }
      },
      (error) => {
        this.toastr.error(error.message);
        console.error(error);
      }
    );
  }
  

  verifyPayment(paymentResponse: any) {
    console.log("Verifying payment with data:", paymentResponse);
    this.orderService.paymentVerification(paymentResponse).subscribe(
      (response) => {
        this.toastr.success('Payment Verified');
        console.log(response);
      },
      (error) => {
        console.error("Error during payment verification:", error);
      }
    );
  }
  
}
