import { Routes } from '@angular/router';
import { LoginComponent } from './features/auth/login/login.component';
import { authGuard } from './core/guards/auth.guard';
import { SignUpComponent } from './features/auth/sign-up/sign-up.component';
import { ForgotPasswordComponent } from './features/auth/forgot-password/forgot-password.component';
import { PageNotFoundComponent } from './core/components/page-not-found/page-not-found.component';

export const routes: Routes = [
    // AUTH ROUTES
    {path: 'login', component: LoginComponent},
    {path: 'sign-up', component: SignUpComponent},
    {path: 'forgot-password', component: ForgotPasswordComponent},

    {
      path: '',
      loadComponent: () =>
        import(
          './features/dashboard/dashboard.component'
        ).then((m) => m.DashboardComponent),
    },
    {
        path: 'profile',
        loadComponent: () =>
          import(
            './features/profile/profile.component'
          ).then((m) => m.ProfileComponent),
        canMatch: [authGuard],
    },
    
    // PRODUCT DETAILS
    {
        path: 'product-details/:id',
        loadComponent: () =>
          import(
            './features/products/product-details/product-details.component'
          ).then((m) => m.ProductDetailsComponent),
    },
    {
        path: 'products',
        loadComponent: () =>
          import(
            './features/products/product-list/product-list.component'
          ).then((m) => m.ProductListComponent),
    },

    // CART
    {
        path: 'cart',
        loadComponent: () =>
          import(
            './features/cart/cart-page/cart-page.component'
          ).then((m) => m.CartPageComponent),
        canMatch: [authGuard],
    },

    // Order
    {
        path: 'place-order',
        loadComponent: () =>
          import(
            './features/order/place-order/place-order.component'
          ).then((m) => m.PlaceOrderComponent),
        canMatch: [authGuard],
    },
    {
        path: 'order-list',
        loadComponent: () =>
          import(
            './features/order/order-list/order-list.component'
          ).then((m) => m.OrderListComponent),
        canMatch: [authGuard],
    },
    {
        path: 'order-confirmed',
        loadComponent: () =>
          import(
            './features/order/thankyou-order/thankyou-order.component'
          ).then((m) => m.ThankyouOrderComponent),
        canMatch: [authGuard],
    },
    {
        path: 'order-details/:id',
        loadComponent: () =>
          import(
            './features/order/order-details/order-details.component'
          ).then((m) => m.OrderDetailsComponent),
        canMatch: [authGuard],
    },

    // 404
    {path: '**', component: PageNotFoundComponent}
];
