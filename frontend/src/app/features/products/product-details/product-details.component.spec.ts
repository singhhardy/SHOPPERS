import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductDetailsComponent } from './product-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { of } from 'rxjs';
import { AuthService } from '../../../core/services/auth.service';
import { CartService } from '../../services/cart.service';
import { ProductService } from '../../services/product.service';

describe('ProductDetailsComponent', () => {
  let component: ProductDetailsComponent;
  let fixture: ComponentFixture<ProductDetailsComponent>;

  const mockActivatedRoute = {
    paramMap: of({
      get: (key: string) => 'prod123'
    })
  };

  const mockRouter = {
    navigate: jasmine.createSpy('navigate')
  };

  const mockProductService = {
    getProductById: jasmine.createSpy('getProductById').and.returnValue(of({
      product: {
        _id: 'prod123',
        name: 'Test Product',
        numReviews: 0
      }
    }))
  };

  const mockCartService = {
    AddToCart: jasmine.createSpy('AddToCart').and.returnValue(of({
      message: 'Added to cart'
    }))
  };

  const mockAuthService = {
    isLoggedIn: jasmine.createSpy('isLoggedIn').and.returnValue(true)
  };

  const mockToastrService = {
    success: jasmine.createSpy('success'),
    error: jasmine.createSpy('error'),
    warning: jasmine.createSpy('warning')
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductDetailsComponent, 
        HttpClientTestingModule,
        ToastrModule.forRoot()
      ],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: Router, useValue: mockRouter },
        { provide: ProductService, useValue: mockProductService },
        { provide: CartService, useValue: mockCartService },
        { provide: AuthService, useValue: mockAuthService },
        { provide: ToastrService, useValue: mockToastrService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
