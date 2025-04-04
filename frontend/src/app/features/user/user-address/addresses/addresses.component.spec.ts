import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddressesComponent } from './addresses.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ToastrModule } from 'ngx-toastr';

describe('AddressesComponent', () => {
  let component: AddressesComponent;
  let fixture: ComponentFixture<AddressesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddressesComponent, HttpClientTestingModule,  ToastrModule.forRoot()]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddressesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
