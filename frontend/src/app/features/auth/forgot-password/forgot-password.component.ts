import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.component.html',
  styleUrl: './forgot-password.component.css'
})
export class ForgotPasswordComponent {
  resetPassForm: FormGroup
  showFields: boolean = false

  constructor(private fb: FormBuilder, 
    private auth: AuthService, 
    private toastr: ToastrService,
    private router: Router
  ){
    this.resetPassForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      otp: [''],
      newPassword: ['']
    })
  }

  onSubmit(){
    const email = this.resetPassForm.value.email
    this.auth.forgotPass({email}).subscribe(
      (response: any) => {
        this.showFields = true
        console.log(response)
        this.toastr.success(response.message)
      },
      (error: any) => {
        const errorMessage = error.error?.message || 'An unexpected error occurred';
        this.toastr.error(errorMessage) 
      }
    )
  }

  reset(){
    const userData = {
      email: this.resetPassForm.value.email,
      otp: this.resetPassForm.value.otp,
      newPassword: this.resetPassForm.value.newPassword
    }

    console.log(userData)
    this.auth.resetPass(userData).subscribe(
      (response: any) => {
        console.log(response)
        this.toastr.success(response.message)
        this.router.navigate(["/login"])
      },
      (error: any) => {
        const errorMessage = error.error?.message || 'An unexpected error occurred';
        this.toastr.error(errorMessage)
      }
    )
  }

}
