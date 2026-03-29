import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientorderComponent } from './clientorder.component';

describe('ClientorderComponent', () => {
  let component: ClientorderComponent;
  let fixture: ComponentFixture<ClientorderComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ClientorderComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientorderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
