import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ConfirmModalComponent } from '../../../../shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-addresses',
  imports: [CommonModule],
  templateUrl: './addresses.component.html',
  styleUrl: './addresses.component.css'
})
export class AddressesComponent {
  addresses: any = []

  constructor(private userService: UserService, private toastr: ToastrService, private modalService: NgbModal){
  }

  ngOnInit() {
    this.userService.addresses$.subscribe((addresses) => {
      this.addresses = addresses || [];
    });
    this.userService.fetchAddresses();
  }

  deleteAddress(addressId: string){
    console.log(addressId)

    const modalRef = this.modalService.open(ConfirmModalComponent);
    modalRef.componentInstance.title = 'Are you sure?';
    modalRef.componentInstance.message = `Do you want to delete this address?`;

    modalRef.componentInstance.confirm.subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.userService.DeleteAddress(addressId).subscribe({
          next: () => {
            this.toastr.success('Address Deleted Successfully');
            this.userService.fetchAddresses();
          },
          error: (error) => {
            console.error("Delete Error:", error);
            this.toastr.error('Something went wrong', error.message);
          }
        });
      } else {
        console.log('Order cancellation canceled');
      }
    });
    
  }

}
