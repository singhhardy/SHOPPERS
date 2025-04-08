import { Component, OnInit } from '@angular/core';
import { NgbCollapse, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { Observable } from 'rxjs';
import { CartService } from '../../../features/services/cart.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports:  [NgbCollapse, NgbDropdownModule, RouterModule, NgIf, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isNavbarCollapsed = true;
  user$: Observable<any>;
  cartItemsCount: any

  constructor(public auth: AuthService, private cart: CartService, public toastr: ToastrService){
    this.user$ = this.auth.user$
  }

  ngOnInit(){
    this.cart.currentCartItemCount.subscribe(count => {
      this.cartItemsCount = count;
    });
  }

  signOut() {
    this.auth.logout()
    this.toastr.success('Signed Out')
    this.cartItemsCount = ''
  }


}
