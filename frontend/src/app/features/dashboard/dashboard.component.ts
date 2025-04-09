import { Component } from '@angular/core';
import { ProductListComponent } from "../products/product-list/product-list.component";
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';
import { RouterModule } from '@angular/router';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, NgbCarouselModule, RouterModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

  constructor(private userService: UserService, private toastr: ToastrService){}
  
  onSubscribe(email: any) {
    if (!email || !email.includes('@')) {
      this.toastr.error('Please enter a valid email');
      return;
    }
  
    this.userService.SubscribeNewsletter(email).subscribe(
      (response) => {
        this.toastr.success(response.message);
      },
      (error) => {
        console.log(error.message);
        this.toastr.error(error.error?.message || 'Something went wrong');
      }
    );
  }
  
}
