import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { DashboardComponent } from './features/dashboard/dashboard.component';
import { authGuard } from './core/guards/auth.guard';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { ProfileComponent } from './features/profile/profile.component';
import { ProductDetailsComponent } from './features/products/product-details/product-details.component';
import { CartPageComponent } from './features/cart/cart-page/cart-page.component';
import { PlaceOrderComponent } from './features/order/place-order/place-order.component';
import { OrderListComponent } from './features/order/order-list/order-list.component';
import { ThankyouOrderComponent } from './features/order/thankyou-order/thankyou-order.component';
import { OrderDetailsComponent } from './features/order/order-details/order-details.component';

export const routes: Routes = [
    // AUTH ROUTES
    {path: '', component: DashboardComponent},
    {path: 'login', component: LoginComponent},
    {path: 'sign-up', component: SignUpComponent},
    {path: 'profile', component: ProfileComponent, canActivate: [authGuard]},
    {path: 'forgot-password', component: ForgotPasswordComponent},
    
    // PRODUCT DETAILS
    {path: 'product-details/:id', component: ProductDetailsComponent},

    // CART
    {path: 'cart', component: CartPageComponent,  canActivate: [authGuard]},

    // Order
    {path: 'place-order', component: PlaceOrderComponent, canActivate: [authGuard]},
    {path: 'order-list', component: OrderListComponent, canActivate: [authGuard]},
    {path: 'order-confirmed', component: ThankyouOrderComponent, canActivate: [authGuard]},
    {path: 'order-details/:id', component: OrderDetailsComponent, canActivate: [authGuard]}
];
