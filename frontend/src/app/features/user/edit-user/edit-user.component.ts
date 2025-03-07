import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { UserService } from '../../../core/services/user.service';
import { AuthService } from '../../../core/services/auth.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-edit-user',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './edit-user.component.html',
  styleUrl: './edit-user.component.css'
})
export class EditUserComponent {
  profileForm: FormGroup
  user$: Observable<any>

  constructor(private userAuth: UserService, private fb: FormBuilder, private toastr: ToastrService, private auth: AuthService){
    this.profileForm = this.fb.group({
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      dateOfBirth: ['', [Validators.required]]
    })
    this.user$ = this.auth.user$
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
