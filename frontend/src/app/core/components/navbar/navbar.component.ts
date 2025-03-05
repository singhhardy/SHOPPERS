import { Component, OnInit } from '@angular/core';
import { NgbCollapse, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { NgIf } from '@angular/common';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports:  [NgbCollapse, NgbDropdownModule, RouterModule, NgIf],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isNavbarCollapsed = true;
  user: any

  constructor(public auth: AuthService){}

  ngOnInit(){
    this.GetUser()
  }

  signOut() {
    this.auth.logout()
    this.user = null;
    console.log('Logged out')
  }
  
  GetUser(){
    this.auth.getMe().subscribe(
      (response: any) => {
        this.user = response.user
      },
      (error:any) => {
        console.log(error)
      }
    )
  }

}
