import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  // LOG IN 

  loginUser(user: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/auth/login`, user)
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  logout(): void{
    localStorage.removeItem('token')
  }

  isLoggedIn(): boolean{
    return !!this.getToken()
  }

  getMe(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/users/user-profile`)
  }

  // SIGN UP
  SignUpUser(userData: any): Observable<any[]>{
    return this.http.post<any[]>(`${this.baseUrl}/auth/email-signup`, userData)
  }
  
  VerifyOtp(userData: any): Observable<any[]>{
    return this.http.post<any[]>(`${this.baseUrl}/auth/otp-verify`, userData)
  }

  resendOTP(email: any): Observable<any[]>{
    return this.http.post<any[]>(`${this.baseUrl}/auth/resend-otp`, email)
  }

  // RECOVERY

  forgotPass(email: any): Observable<any[]>{
    return this.http.post<any[]>(`${this.baseUrl}/auth/forgot-pass`, email)
  }

  resetPass(userData: any): Observable<any[]>{
    return this.http.post<any[]>(`${this.baseUrl}/auth/reset-pass`, userData)
  }

}
