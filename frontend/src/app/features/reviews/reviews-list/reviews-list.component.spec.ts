import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReviewsListComponent } from './reviews-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { ReviewsService } from '../../services/reviews.service';

describe('ReviewsListComponent', () => {
  let component: ReviewsListComponent;
  let fixture: ComponentFixture<ReviewsListComponent>;

  const mockActivatedRoute = {
    paramMap: of({
      get: (key: string) => '123'
    })
  };

  const mockReviewsService = {
    getProductReviews: jasmine.createSpy('getProductReviews').and.returnValue(of([])) 
  };

  const mockToastrService = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReviewsListComponent,
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: ReviewsService, useValue: mockReviewsService },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ReviewsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
