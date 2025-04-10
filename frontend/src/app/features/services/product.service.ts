import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
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

  searchProducts(
query: string, page: number, limit: number, category?: string, minPrice?: number, maxPrice?: number, brand?: string, minRating?: number | null, sort?: string): Observable<any> {
      let params = new HttpParams()
      .set('q', query)
      .set('page', page.toString())
      .set('limit', limit.toString())

      if(category){
        params = params.set('category', category)
      }
      if(minPrice !== null && minPrice !== undefined){
        params = params.set('minPrice', minPrice?.toString())
      }
      if(maxPrice !== null && maxPrice !== undefined){
        params = params.set('maxPrice', maxPrice?.toString())
      }
      if(brand){
        params = params.set('brand', brand)
      }
      if (minRating !== null && minRating !== undefined) {
        params = params.set('minRating', minRating.toString());
      }
      if (sort) params = params.set('sort', sort);

      return this.http.get<any>(`${this.baseUrl}/products/search`, { params })
  }

  updateSearchQuery(query: string) {
    this.searchQuerySource.next(query);
  }

}
