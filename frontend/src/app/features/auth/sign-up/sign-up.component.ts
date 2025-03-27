import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validator, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpForm: FormGroup;
  showPassword: boolean = false;
  showOTP: boolean = false
  OTP: Number = 0
  isSubmitting: boolean = false

  constructor(
    private fb: FormBuilder, 
    private auth: AuthService, 
    private router: Router,
    private toastr: ToastrService
  ){
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      phone: ['', [Validators.required]],
      password: ['', [Validators.required]],
      otp: ['']
    })
  }
 
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(){
    this.isSubmitting = true
    console.log(this.signUpForm.value)
    this.auth.SignUpUser(this.signUpForm.value).subscribe(
      (response: any) => {
        console.log(response)
        this.showOTP = true
        this.isSubmitting = false
        this.toastr.success(response.message)
      },
      (error: any) => {
        console.log(error)
        this.isSubmitting = false
        const errorMessage = error.error?.message || error.message || 'An unexpected error occurred';
        this.toastr.error(errorMessage)
      }
    )
  }

  Verify(){
    const userData = {
      email: this.signUpForm.value.email,
      otp: this.signUpForm.value.otp,
      type: 'register'
    }

    console.log(userData)
    this.auth.VerifyOtp(userData).subscribe(
      (response: any) => {
        console.log(response)
        this.router.navigate(['/login'])
        this.toastr.success('Please Login', response.message)
      },
      (error: any) => {
        console.log(error)
        const errorMessage = error.error?.message || 'An unexpected error occurred';
        this.toastr.error(errorMessage)
      }
    )
  }

  resendOTP(){
    const email = this.signUpForm.value.email

    this.auth.resendOTP({email}).subscribe(
      (response: any) => {
        this.toastr.success(response)
        console.log(response)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

}
