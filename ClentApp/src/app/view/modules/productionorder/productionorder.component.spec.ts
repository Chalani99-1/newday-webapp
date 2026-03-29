import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProductionorderComponent } from './productionorder.component';

describe('ProductionorderComponent', () => {
  let component: ProductionorderComponent;
  let fixture: ComponentFixture<ProductionorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProductionorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProductionorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
