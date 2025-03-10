import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from '../../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { Observable } from 'rxjs';
import { AuthService } from '../../../../core/services/auth.service';
import { AddressesComponent } from "../addresses/addresses.component";
import { Router } from '@angular/router';

@Component({
  selector: 'app-addnew-address',
  imports: [CommonModule, ReactiveFormsModule, AddressesComponent],
  standalone: true,
  templateUrl: './addnew-address.component.html',
  styleUrl: './addnew-address.component.css'
})
export class AddnewAddressComponent {
  showAddressForm = false
  userAddresses: any
  user$: Observable<any>
  addresses: any[] = [];

  addressForm = new FormGroup({
    address: new FormGroup({
      addressName: new FormControl('', Validators.required),
      street: new FormControl('', Validators.required),
      city: new FormControl('', Validators.required),
      state: new FormControl('', Validators.required),
      country: new FormControl('', Validators.required),
      zipCode: new FormControl('', [Validators.required, Validators.pattern('^[0-9]{5,6}$')]) // 5 or 6 digit zip code validation
    })
  });

  constructor(private userService: UserService, private toastr: ToastrService, private auth: AuthService, private router: Router){
    this.user$ = this.auth.user$
  }

  toggleForm(){
    this.showAddressForm = !this.showAddressForm
  }

  onSubmit(){
    if(this.addressForm.valid){
      console.log(this.addressForm.value)
    }
    this.userService.AddNewAddress(this.addressForm.value).subscribe(
      (response) => {
        console.log(response)
        this.toastr.success('Address Added Successfully')
        this.showAddressForm = false
        this.userService.fetchAddresses();
      },
      (error) => {
        console.log(error)
        this.toastr.error('Something went Wrong', error.message)
      }
    )
  }

}
