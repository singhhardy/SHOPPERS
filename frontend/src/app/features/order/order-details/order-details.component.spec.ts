import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OrderDetailsComponent } from './order-details.component';
import { OrderService } from '../../services/order.service';
import { ActivatedRoute } from '@angular/router';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { of } from 'rxjs';
import { ProductService } from '../../services/product.service';

describe('OrderDetailsComponent', () => {
  let component: OrderDetailsComponent;
  let fixture: ComponentFixture<OrderDetailsComponent>;

    const mockActivatedRoute = {
      paramMap: of({
        get: (key: string) => 'order123'
      })
    };
  
    const mockOrderService = {
      OrderById: jasmine.createSpy('OrderById').and.returnValue(of({
        order: {
          _id: 'order123',
          items: [
            { productId: 'prod1' },
            { productId: 'prod2' }
          ]
        }
      })),
      CancelOrder: jasmine.createSpy('CancelOrder').and.returnValue(of({
        message: 'Order cancelled'
      }))
    };
  
    const mockProductService = {
      getProductById: jasmine.createSpy('getProductById').and.returnValue(of({
        product: { name: 'Mock Product' }
      }))
    };
  
    const mockToastr = {
      success: jasmine.createSpy('success'),
      error: jasmine.createSpy('error')
    };
  
    const mockModalService = {
      open: jasmine.createSpy('open').and.returnValue({
        componentInstance: {
          confirm: of(true), 
          title: '',
          message: ''
        }
      })
    };
  
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [
          OrderDetailsComponent,
          HttpClientTestingModule,
          ToastrModule.forRoot()
        ],
        providers: [
          { provide: ActivatedRoute, useValue: mockActivatedRoute },
          { provide: OrderService, useValue: mockOrderService },
          { provide: ProductService, useValue: mockProductService },
          { provide: ToastrService, useValue: mockToastr },
          { provide: NgbModal, useValue: mockModalService }
        ]
      }).compileComponents();
  
      fixture = TestBed.createComponent(OrderDetailsComponent);
      component = fixture.componentInstance;
      fixture.detectChanges(); 
    });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
