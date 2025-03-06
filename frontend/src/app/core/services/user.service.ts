import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  EditProfile(userData: any): Observable<any[]>{
    return this.http.put<any[]>(`${this.baseUrl}/users/editprofile`, userData)
  }

  AddNewAddress(userData: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/users/addresses/`, userData)
  }

  GetUserAddresses(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/users/addresses`)
  }

  DeleteAddress(addressId: any): Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/users/address/${addressId}`)
  }

}
