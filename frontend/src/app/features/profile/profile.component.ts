import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { EditUserComponent } from "../edit-user/edit-user.component";

@Component({
  selector: 'app-profile',
  imports: [CommonModule, EditUserComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  activeTab = 'profile'
  
}
