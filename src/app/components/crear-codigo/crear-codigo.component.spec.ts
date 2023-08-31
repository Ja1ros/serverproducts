import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearCodigoComponent } from './crear-codigo.component';

describe('CrearCodigoComponent', () => {
  let component: CrearCodigoComponent;
  let fixture: ComponentFixture<CrearCodigoComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CrearCodigoComponent]
    });
    fixture = TestBed.createComponent(CrearCodigoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
