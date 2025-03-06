import { Component, OnInit } from '@angular/core';
import { NgbCollapse, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

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

  constructor(public auth: AuthService){
    this.user$ = this.auth.user$
  }

  ngOnInit(){
  }

  signOut() {
    this.auth.logout()
    console.log('Logged out')
  }

}
