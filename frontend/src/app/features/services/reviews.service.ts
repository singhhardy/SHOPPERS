import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private baseUrl = environment.baseUrl

  constructor(private http: HttpClient) { }

  AddReview(id: string, reviewData: any ): Observable<any>{
    return this.http.post<any>(`${this.baseUrl}/product/reviews/add/${id}`, reviewData)
  }

  getProductReviews(id: any): Observable<{ reviews: any[]}>{
    return this.http.get< {reviews: any[] }>(`${this.baseUrl}/product/reviews/${id}`)
  }

}
