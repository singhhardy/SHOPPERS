import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductService } from '../../services/product.service';
import { ProductListComponent } from './product-list.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';

describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ProductListComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            queryParams: of({ q: '', page: '1' }),
            snapshot: {
              paramMap: {
                get: (key: string) => null,
              }
            }
          }
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate')
          }
        },
        {
          provide: ProductService,
          useValue: {
            searchProducts: () => of({ results: [], total: 0 })
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products based on query params', () => {
    spyOn(component, 'loadProducts');
    component.ngOnInit();
    expect(component.searchText).toBe('');
    expect(component.currentPage).toBe(1);
    expect(component.loadProducts).toHaveBeenCalled();
  });

});
