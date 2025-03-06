import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EditUserComponent } from "../edit-user/edit-user.component";
import { Observable } from 'rxjs';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, EditUserComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  activeTab = 'profile'
  user$: Observable<any>

  constructor(public auth: AuthService){
    this.user$ = this.auth.user$
  }
  
}
