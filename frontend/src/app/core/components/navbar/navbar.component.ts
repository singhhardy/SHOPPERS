import { Component, OnInit } from '@angular/core';
import { NgbCollapse, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { CartService } from '../../../features/services/cart.service';
import { ToastrService } from 'ngx-toastr';
import { ProductService } from '../../../features/services/product.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports:  [NgbCollapse, NgbDropdownModule, RouterModule, NgIf, CommonModule, FormsModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isNavbarCollapsed = true;
  isSidebarOpen = false
  user$: Observable<any>;
  cartItemsCount: any
  searchText = '';

  constructor(
    public auth: AuthService, 
    private cart: CartService, 
    public toastr: ToastrService,
    public productService: ProductService,
    private router: Router){
    this.user$ = this.auth.user$
  }

  ngOnInit(){
    this.cart.currentCartItemCount.subscribe(count => {
      this.cartItemsCount = count;
    });
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }
  
  closeSidebar() {
    this.isSidebarOpen = false;
  }

  onSearch(){
    this.router.navigate(['/products'], { queryParams: { q: this.searchText } });
  }

  signOut() {
    this.auth.logout()
    this.toastr.success('Signed Out')
    this.cartItemsCount = ''
  }


}
