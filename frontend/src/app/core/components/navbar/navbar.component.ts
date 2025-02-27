import { Component, OnInit } from '@angular/core';
import { NgbCollapse, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap'
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports:  [NgbCollapse, NgbDropdownModule, RouterModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  isNavbarCollapsed = true;
}
