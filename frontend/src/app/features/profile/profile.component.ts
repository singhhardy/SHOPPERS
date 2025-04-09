import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EditUserComponent } from '../user/edit-user/edit-user.component';
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { AddnewAddressComponent } from "../user/user-address/addnew-address/addnew-address.component";
import { AddressesComponent } from "../user/user-address/addresses/addresses.component";

@Component({
  selector: 'app-profile',
  imports: [CommonModule, EditUserComponent, AddnewAddressComponent, AddressesComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  activeTab = 'profile'
  user$: Observable<any>

  constructor(public auth: AuthService){
    this.user$ = this.auth.user$
  }

  ngOnInit(){
    this.user$ = this.auth.user$
  }

}
