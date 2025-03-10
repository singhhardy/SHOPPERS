import { Component } from '@angular/core';
import { ProductListComponent } from "../products/product-list/product-list.component";

@Component({
  selector: 'app-dashboard',
  imports: [ProductListComponent],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent {

}
