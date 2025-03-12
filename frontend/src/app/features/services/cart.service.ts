import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private baseUrl = environment.baseUrl

  constructor(private http: HttpClient) {}

  AddToCart(item: any): Observable<any[]>{
    return this.http.post<any[]>(`${this.baseUrl}/cart`, item)
  }

  getMyCart(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/cart`)
  }

  removeItemFromCart(id: any): Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/cart/${id}`)
  }

  getCartTotal(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/cart/total`)
  }

  clearCart(): Observable<any>{
    return this.http.delete<any>(`${this.baseUrl}/cart/clear`)
  }

  updateCart(cartData: any): Observable<any[]>{
    return this.http.put<any[]>(`${this.baseUrl}/cart`, cartData)
  }

}
