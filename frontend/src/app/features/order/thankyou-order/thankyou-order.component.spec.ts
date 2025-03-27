import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyouOrderComponent } from './thankyou-order.component';

describe('ThankyouOrderComponent', () => {
  let component: ThankyouOrderComponent;
  let fixture: ComponentFixture<ThankyouOrderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThankyouOrderComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ThankyouOrderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
