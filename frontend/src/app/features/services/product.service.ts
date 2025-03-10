import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/products/list`);
  }

  getProductById(id: any): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/products/${id}`)
  }

}
