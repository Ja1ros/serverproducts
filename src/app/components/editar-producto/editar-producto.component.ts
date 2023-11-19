// editar-producto.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { CodigoBarrasService } from 'src/app/services/codigo.service';

@Component({
  selector: 'app-editar-producto',
  templateUrl: './editar-producto.component.html',
  styleUrls: ['./editar-producto.component.css']
})
export class EditarProductoComponent implements OnInit {
  productoForm: FormGroup;
  titulo = 'Editar producto';
  id: string | null;
  codigoBarras: string = '';
  producto: Producto = { nombre: '', codigo: '', peso: 0, precio: 0 }; // Inicializa la propiedad producto

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService,
    private _productoService: ProductoService,
    private codigoBarrasService: CodigoBarrasService,
    private aRouter: ActivatedRoute
  ) {
    this.productoForm = this.fb.group({
      nombre: [{ value: '', disabled: true }, Validators.required],
      codigo: [{ value: '', disabled: true }, Validators.required],
      peso: ['', Validators.required],
    });
  
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.inicializarFormulario();
    this.obtenerProducto();
    this.calcularCodigoBarras();
  }

  

  inicializarFormulario() {
    this.productoForm = this.fb.group({
      nombre: [{ value: '', disabled: true }, Validators.required],
      codigo: [{ value: '', disabled: true }, Validators.required],
      peso: ['', Validators.required],
      precio: [{ value: '', disabled: true }, Validators.required],
    });
  }

  obtenerProducto() {
    if (this.id !== null) {
      this._productoService.obtenerProducto(this.id).subscribe(data => {
        this.producto = data;
        this.productoForm.patchValue({
          nombre: data.nombre,
          codigo: data.codigo,
          peso: data.peso,
          precio: data.precio,
        });
      });
    }
  }

  esEditar() {

    if(this.id !== null) {
      this.titulo = 'Ingresar peso del producto';
      this._productoService.obtenerProducto(this.id).subscribe(data => {
        this.productoForm.setValue({
          producto: data.nombre,
          codigo: data.codigo,
          peso: data.peso,
          precio: data.precio,
        });
      });
      //this.habilitarEdicion();
    }
  }
   calcularCodigoBarras() {

      this.codigoBarras = this.codigoBarrasService.calcularCodigoBarras(
      this.productoForm.get('codigo')?.value,
      this.productoForm.get('peso')?.value,
      this.productoForm.get('precio')?.value
    );
  }

  mostrarCodigoBarras() {
     
        const codigoControl = this.productoForm.get('codigo');
        const pesoControl = this.productoForm.get('peso');
    
        if (codigoControl && pesoControl) {
          const codigo = codigoControl.value;
          const peso = pesoControl.value;
    
          if (codigo && peso) {
            const codigoBarras = this.codigoBarrasService.calcularCodigoBarras(codigo, peso, this.producto.precio);
      console.log('Código de Barras:', codigoBarras);
          } else {
            console.error('Error: El código y el peso deben tener valores válidos.');
          }
        } else {
          console.error('Error: Los controles de código o peso son nulos.');
        }
    }

    guardarProducto() {
      const productoEditado: Producto = {
        nombre: this.productoForm.get('nombre')?.value,
        codigo: this.productoForm.get('codigo')?.value,
        peso: this.productoForm.get('peso')?.value,
        precio: this.productoForm.get('precio')?.value,
      };

    // Llama al servicio para guardar el producto
    this._productoService.guardarProducto(productoEditado).subscribe(
      (productoGuardado) => {
        // Maneja el resultado después de guardar
        // Puedes redirigir a la lista de productos o hacer otras acciones necesarias
        this.toastr.success('Producto guardado exitosamente');
        this.router.navigate(['/']); // Redirige a la lista de productos
      },
      (error) => {
        // Maneja el error si ocurre
        this.toastr.error('Error al guardar el producto');
        console.error(error);
      }
    );


    
  }   
  volver() {
    this.router.navigate(['/']); // Puedes redirigir a la lista de productos u otra ruta según tus necesidades.
  }
  
}

 


