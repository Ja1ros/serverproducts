import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListarProductosComponent } from './listar-producto.component';

describe('ListarProductoComponent', () => {
  let component: ListarProductosComponent;
  let fixture: ComponentFixture<ListarProductosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListarProductosComponent]
    });
    fixture = TestBed.createComponent(ListarProductosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
