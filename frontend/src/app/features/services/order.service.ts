import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private baseUrl = environment.baseUrl

  constructor(private http: HttpClient){}

  placeOrder(OrderData: any): Observable<any>{
    return this.http.post<any[]>(`${this.baseUrl}/order`, OrderData)
  }

  myOrders(): Observable<any[]>{
    return this.http.get<any[]>(`${this.baseUrl}/order/my-order`)
  }

  paymentVerification(paymentResponse: any): Observable<any[]>{
    return this.http.post<any[]>(`${this.baseUrl}/order/verify-payment`, paymentResponse)
  }
  
}
