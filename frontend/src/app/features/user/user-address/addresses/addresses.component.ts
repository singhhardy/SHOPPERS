import { Component } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-addresses',
  imports: [CommonModule,],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent {
  addresses: any = []

  constructor(private userService: UserService, private toastr: ToastrService){
  }

  ngOnInit() {
    this.userService.addresses$.subscribe((addresses) => {
      this.addresses = addresses || [];
    });
    this.userService.fetchAddresses();
  }

  deleteAddress(addressId: string){
    console.log(addressId)
    this.userService.DeleteAddress(addressId).subscribe({
      next: () => {
        this.toastr.success('Address Deleted Successfully');
        this.userService.fetchAddresses();
      },
      error: (error) => {
        console.error("Delete Error:", error);
        this.toastr.error('Something went wrong', error.message);
      }
    });
  }

}
