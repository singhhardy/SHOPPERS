import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validator, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sign-up',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './sign-up.component.html',
  styleUrl: './sign-up.component.css'
})
export class SignUpComponent {
  signUpForm: FormGroup;
  showPassword: boolean = false;
  showOTP: boolean = false
  OTP: Number = 0

  constructor(private fb: FormBuilder, private auth: AuthService){
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]],
      otp: ['']
    })
  }
 
  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

  onSubmit(){
    this.auth.SignUpUser(this.signUpForm.value).subscribe(
      (response: any) => {
        console.log(response)
        this.showOTP = true
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  Verify(){
    const userData = {
      email: this.signUpForm.value.email,
      otp: Number(this.signUpForm.value.otp),
      type: 'register'
    }

    console.log(userData)
    this.auth.VerifyOtp(userData).subscribe(
      (response: any) => {
        console.log(response)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

  resendOTP(){
    const email = this.signUpForm.value.email

    this.auth.resendOTP(email).subscribe(
      (response: any) => {
        console.log(response)
      },
      (error: any) => {
        console.log(error)
      }
    )
  }

}
