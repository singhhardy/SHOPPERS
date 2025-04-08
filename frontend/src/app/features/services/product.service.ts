import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private baseUrl = environment.baseUrl
  private searchQuerySource = new BehaviorSubject<string>('');
  searchQuery$ = this.searchQuerySource.asObservable();
  
  constructor(private http: HttpClient) { }

  getAllProducts(): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/products/list`);
  }

  getProductById(id: any): Observable<any>{
    return this.http.get<any>(`${this.baseUrl}/products/${id}`)
  }

  searchProducts(query: string, page: number, limit: number): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/products/search`, {
      params: {
        q: query,
        page,
        limit
      }
    });
  }

  updateSearchQuery(query: string) {
    this.searchQuerySource.next(query);
  }

}
