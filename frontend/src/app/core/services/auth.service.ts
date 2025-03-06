import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment'
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject, tap, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any | null>(null);
  public user$ = this.userSubject.asObservable();
  baseUrl = environment.baseUrl
  currentUser: any;

  constructor(private http: HttpClient, private router: Router) { 
    this.loadUserOnInit()
  }

  // Load User
  private loadUserOnInit(){
    const token = localStorage.getItem('token')
    if(token){
      this.getMe().subscribe()
    }
  }

  // LOG IN 

  loginUser(user: any): Observable<any[]> {
    return this.http.post<any[]>(`${this.baseUrl}/auth/login`, user)
  }

  getToken(): string | null {
    return localStorage.getItem('token')
  }

  logout(): void{
    localStorage.removeItem('token')
    this.userSubject.next(null); 
    this.router.navigate(['/'])
  }

  isLoggedIn(): boolean{
    return !!this.getToken()
  }

  getMe(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/users/user-profile`).pipe(
      tap((response) => {
        this.userSubject.next(response.user)
      }),
      catchError((error) => {
        this.userSubject.next(null);
        return throwError(() => error)
      })
    )
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
