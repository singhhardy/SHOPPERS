import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReviewsService } from '../../services/reviews.service';
import { AddReviewComponent } from './add-review.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';

describe('AddReviewComponent', () => {
  let component: AddReviewComponent;
  let fixture: ComponentFixture<AddReviewComponent>;

  const mockActivatedRoute = {
    paramMap: of({
      get: (key: string) => '123'
    })
  };

  const mockReviewsService = {
    AddReview: jasmine.createSpy('AddReview').and.returnValue(of({
      message: 'Review submitted!',
      reviewCount: 10
    })),
    getProductReviews: jasmine.createSpy('getProductReviews').and.returnValue(of([]))
  };

  const mockToastrService = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AddReviewComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ReviewsService, useValue: mockReviewsService },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AddReviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
