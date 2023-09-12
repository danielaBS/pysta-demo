import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UbicacionVendedoresComponent } from './ubicacion-vendedores.component';

describe('UbicacionVendedoresComponent', () => {
  let component: UbicacionVendedoresComponent;
  let fixture: ComponentFixture<UbicacionVendedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UbicacionVendedoresComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UbicacionVendedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
