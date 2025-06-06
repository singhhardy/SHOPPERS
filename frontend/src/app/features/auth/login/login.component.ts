import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validator, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from  '@angular/router'
import { ToastrService } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup
  showPassword: boolean = false;

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router,
    private toastr: ToastrService, private cart: CartService
  ){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  togglePassword(): void{
    this.showPassword = !this.showPassword
  }
  
  onSubmit(){
    if(this.loginForm.valid){
      this.auth.loginUser(this.loginForm.value).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token)
          

          this.auth.getMe().subscribe(
            () => {
              this.router.navigate(['/'])
              this.cart.loadCart()
              this.toastr.success('Logged In Successfully')
            },
            (error) => {
              console.log(error)
            }
          )
        }
      );
    }
  }

}
