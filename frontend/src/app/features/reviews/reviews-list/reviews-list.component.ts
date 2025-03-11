import { Component } from '@angular/core';
import { ReviewsService } from '../../services/reviews.service';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reviews-list',
  imports: [CommonModule],
  templateUrl: './reviews-list.component.html',
  styleUrl: './reviews-list.component.css'
})
export class ReviewsListComponent {
  id: string | null = null
  reviews: any[] = []

  constructor(private review: ReviewsService, private router: ActivatedRoute){}

  ngOnInit(){
    this.router.paramMap.subscribe(params => {
      this.id = params.get('id');
      
      if (this.id) {
        this.getReviews();
      }
    });
  }

  getReviews(){
    this.review.getProductReviews(this.id).subscribe(
      (response) => {
        console.log(response)
        this.reviews = response.reviews
      },
      (error) => {
        console.log(error)
      }
    )
  }

}
