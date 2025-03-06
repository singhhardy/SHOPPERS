import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddnewAddressComponent } from './addnew-address.component';

describe('AddnewAddressComponent', () => {
  let component: AddnewAddressComponent;
  let fixture: ComponentFixture<AddnewAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddnewAddressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddnewAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
