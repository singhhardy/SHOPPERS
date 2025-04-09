import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.baseUrl
  private addressesSubject = new BehaviorSubject<any[]>([]);
  addresses$ = this.addressesSubject.asObservable();

  constructor(private http: HttpClient) { }

  updateAddresses(addresses: any[]) {
    this.addressesSubject.next(addresses);
  }

  fetchAddresses() {
    this.GetUserAddresses().subscribe(
      (data: any) => {
        let addressesArray: any[] = [];
        if (data && data.addresses && Array.isArray(data.addresses)) {
          addressesArray = data.addresses;
        }
        else if (Array.isArray(data)) {
          addressesArray = data;
        } 
        this.updateAddresses(addressesArray);
      },
      error => {
        console.error('Error fetching addresses', error);
      }
    );
  }

  EditProfile(userData: any): Observable<any[]>{
    return this.http.put<any[]>(`${this.baseUrl}/users/editprofile`, userData)
  }

  AddNewAddress(userData: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/users/addresses/`, userData)
  }

  GetUserAddresses(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/users/user-addresses`)
  }

  DeleteAddress(addressId: any): Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/users/address/${addressId}`)
  }

  SubscribeNewsletter(email: any): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/users//subscribe-newsletter`, { email })
  }

}
