import { Component, Input, Output, EventEmitter } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-confirm-modal',
  imports: [],
  templateUrl: './confirm-modal.component.html',
  styleUrl: './confirm-modal.component.css'
})
export class ConfirmModalComponent {
  @Input() title: string = "Confirmation";
  @Input() message: string = "Are you sure?";
  @Output() confirm: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor(public activeModal: NgbActiveModal){}

  onConfirm(){
    this.confirm.emit(true)
    this.activeModal.close()
  }

  onCancel(){
    this.confirm.emit(false)
    this.activeModal.close()
  }

}
