import { Component } from '@angular/core';
import { ProductListComponent } from "../products/product-list/product-list.component";
import { CommonModule } from '@angular/common';
import { NgbCarouselModule } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-dashboard',
  imports: [ProductListComponent, CommonModule, NgbCarouselModule ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
