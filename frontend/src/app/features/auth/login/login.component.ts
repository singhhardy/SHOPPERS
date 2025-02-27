import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validator, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from  '@angular/router'

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  loginForm: FormGroup

  constructor(private fb: FormBuilder, private auth: AuthService, private router: Router){
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    })
  }

  onSubmit(){
    if(this.loginForm.valid){
      this.auth.loginUser(this.loginForm.value).subscribe(
        (response: any) => {
          localStorage.setItem('token', response.token)
          this.router.navigate(['/'])
        },
        (error: any) => {
          console.error('Login failed:', error);
        }
      );
    }
  }

}
