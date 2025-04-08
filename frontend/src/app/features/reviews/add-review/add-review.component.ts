import { CommonModule } from '@angular/common';
import { Component, EventEmitter, ViewChild, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ReviewsService } from '../../services/reviews.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ReviewsListComponent } from "../reviews-list/reviews-list.component";

@Component({
  selector: 'app-add-review',
  imports: [CommonModule, FormsModule, ReviewsListComponent],
  templateUrl: './add-review.component.html',
  styleUrl: './add-review.component.css'
})
export class AddReviewComponent {
  @ViewChild(ReviewsListComponent) reviewsList!: ReviewsListComponent;
  @Output() reviewAdded = new EventEmitter<number>();

  showTextbox: boolean = false
  stars = [1, 2, 3, 4, 5];
  rating = 0;
  ratingText: string = ''
  id: string | null = null;
  
  constructor(private reviews: ReviewsService, private route: ActivatedRoute, private toastr: ToastrService){}


  ngAfterViewInit() {
    if (this.reviewsList) {
      this.reviewsList.getReviews();
    }
  }

  ngOnInit(){
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      this.id = id
    });
  }
  
  rate(rating: number): void {
    this.rating = rating;
  }
  toggleBox(){
    this.showTextbox = !this.showTextbox
  }

  saveRating(){
    if (!this.id) {
      console.error('Review id not found.');
      return;
    }

    const ratingData = {
      comment: this.ratingText,
      rating: this.rating
    }

    this.reviews.AddReview(this.id, ratingData).subscribe(
      response => {
        this.toastr.success(response.message)
        this.reviewAdded.emit(response.reviewCount); 
        if (this.reviewsList) {
          this.reviewsList.getReviews();
        }
        this.ratingText = ''
        this.showTextbox = false
      }
    )
  }

}
