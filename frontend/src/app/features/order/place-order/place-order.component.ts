import { Component, NgZone } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { AddnewAddressComponent } from "../../user/user-address/addnew-address/addnew-address.component";
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-place-order',
  standalone: true,
  imports: [CommonModule, AddnewAddressComponent, FormsModule, RouterModule],
  templateUrl: './place-order.component.html',
  styleUrl: './place-order.component.css'
})
export class PlaceOrderComponent {
  currentStep = 1;
  addresses: any = [];
  selectedAddressId: string = '';
  paymentMethod: string = '';
  cartItems: any[] = []
  isLoading: boolean = false
  user$: Observable<any>;
  

  constructor(
    private userService: UserService,
    private cart: CartService,
    private toastr: ToastrService,
    private orderService: OrderService,
    private ngZone: NgZone,
    private router: Router,
    private auth: AuthService
  ){
    this.user$ = this.auth.user$
  }

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


async confirmOrder(): Promise<void> {
    if (this.isLoading) return;
    this.isLoading = true;
  
    try {
      const user = await firstValueFrom(this.user$);
  
      const OrderData = {
        addressId: this.selectedAddressId,
        paymentMethod: this.paymentMethod
      };
  
      this.orderService.placeOrder(OrderData).subscribe({
        next: (response) => {
          if (response.success) {
            if (this.paymentMethod === "Razorpay") {
              const internalOrderId = response.internalOrderId;
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
                  name:  `${user.firstname ?? ""} ${user.lastName ?? ""}`.trim() || "Test User",  
                  email: user.email || "test@example.com",
                  contact: user.phone || "9999999999"
                },
                notes: {
                  address: "Razorpay Corporate Office"
                },
                theme: {
                  color: "#FF6F61"
                }
              };
  
              // Open Razorpay payment modal
              const razorpay = new (window as any).Razorpay(options);
              razorpay.open();
  
              // Handle payment failures
              razorpay.on("payment.failed", (response: any) => {
                console.error("Payment failed", response);
                this.toastr.error("Payment failed. Try again.");
              });
            } else {
              this.toastr.success("Order placed successfully!");
            }
          } else {
            this.toastr.warning(response.message);
          }
        },
        error: (error) => {
          console.error(error);
          this.toastr.error("Failed to place order. Please try again.");
        },
        complete: () => {
          this.isLoading = false;
        }
      });
  
    } catch (error) {
      console.error("Error fetching user data:", error);
      this.toastr.error("Failed to fetch user data.");
      this.isLoading = false;  
    }
  }

  verifyPayment(paymentResponse: any) {
    console.log("Verifying payment with data:", paymentResponse);
    this.orderService.paymentVerification(paymentResponse).subscribe(
      (response) => {
        this.isLoading = false;
        this.toastr.success('Payment Verified');
        this.router.navigate(["/order-confirmed"])
        console.log(response);
      },
      (error) => {
        console.error("Error during payment verification:", error);
      }
    );
  }
  
}
