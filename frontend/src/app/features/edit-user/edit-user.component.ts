import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { UserService } from '../../core/services/user.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-edit-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  profileForm: FormGroup

  constructor(private userAuth: UserService, private fb: FormBuilder, private toastr: ToastrService){
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      dob: ['', [Validators.required]]
    })
  }

  onSubmit(){
    if(this.profileForm.invalid){
      console.log('Form Not valid')
    }

    this.userAuth.EditProfile(this.profileForm.value).subscribe(
      (response: any) => {
        console.log(response)
        this.toastr.success(response.message)
      },
      (error: any) => {
        console.log(error)
        this.toastr.error(error.message)
      }
    )
  }

}
