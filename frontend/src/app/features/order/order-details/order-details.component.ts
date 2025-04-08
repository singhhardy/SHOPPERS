import { Component } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { TimelineComponent } from '../../../shared/components/timeline/timeline.component';
import { ProductService } from '../../services/product.service';
import { CommonModule } from '@angular/common';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../shared/components/confirm-modal/confirm-modal.component';
import { ToastrService } from 'ngx-toastr';
import { jsPDF } from 'jspdf';
import html2Canvas from 'html2canvas'

@Component({
  selector: 'app-order-details',
  imports: [TimelineComponent, CommonModule],
  templateUrl: './order-details.component.html',
  styleUrl: './order-details.component.css'
})
export class OrderDetailsComponent {
  order: any = {};
  products: any[] = [];
  status: any
  fetchedProducts: any[] = []

  constructor(
    private orderService: OrderService, 
    private route: ActivatedRoute, 
    private productService: ProductService,
    private modalService: NgbModal,
    private toastr: ToastrService
  ){}

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      const orderId = params.get('id');
      this.GetOrderById(orderId)
    })
  }

  generateInvoice(){
    const invoiceElement = document.getElementById('invoice-content')

    if(!invoiceElement){
      console.error("Invoice content not found")
      return
    }

    html2Canvas(invoiceElement, { scale: 2 }).then((canvas) => {
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('p', 'mm', 'a4')

      const imgWidth = 210;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
      pdf.save(`Invoice_${this.order._id}.pdf`);
    })

  }

  getFilteredItems(productId: string) {
      return this.order.items.filter((item: { productId: string; }) => item.productId === productId);
  }


  GetOrderById(orderId: any) {
    this.orderService.OrderById(orderId).subscribe(
      (response) => {
        this.order = response.order
        this.products = this.order.items
        console.log(this.order)

        this.fetchedProducts = [];
        this.order.items.forEach((item: { productId: string; productData?: any; }) => {
          this.productService.getProductById(item.productId).subscribe(
            (productData) => {
              item.productData = productData; 
              this.fetchedProducts.push(item.productData.product);
              console.log(this.fetchedProducts)
            },
            (error) => {
              console.error('Error fetching product details', error);
            }
          );
        });
      },
      (error) => {
        console.log(error);
      }
    );
  }

  CancelOrder(status: string, orderId: string) {
    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Cancel Order';
    modalRef.componentInstance.message = `Are you sure you want to cancel the order with ID: ${orderId}?`;

    modalRef.componentInstance.confirm.subscribe((confirmed: boolean) => {
      if (confirmed) {
        console.log('Order canceled:', status, orderId);
        this.orderService.CancelOrder(status, orderId).subscribe(
          (response) => {
            console.log(response.message)
            this.toastr.success(response.message)
          }
        )
      } else {
        console.log('Order cancellation canceled');
      }
    });
  }
  

}
