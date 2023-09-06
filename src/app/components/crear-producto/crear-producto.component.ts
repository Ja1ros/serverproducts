import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.css']
})
export class CrearProductoComponent implements OnInit {
  productoForm: FormGroup;
  titulo = 'Crear producto';
  id: string | null;
  constructor(private fb: FormBuilder,
              private router: Router,
              private toastr: ToastrService,
              private _productoService: ProductoService,
              private aRouter: ActivatedRoute) { 
    this.productoForm = this.fb.group({
      producto: ['', Validators.required],
      codigo: ['', Validators.required],
      peso: ['', Validators.required],
      precio: ['', Validators.required],
    })
    this.id = this.aRouter.snapshot.paramMap.get('id');
  }

  ngOnInit(): void {
    this.esEditar();
  }

  agregarProducto() {

    const PRODUCTO: Producto = {
      nombre: this.productoForm.get('producto')?.value,
      codigo: this.productoForm.get('codigo')?.value,
      peso: this.productoForm.get('peso')?.value,
      precio: this.productoForm.get('precio')?.value,
    }

    if(this.id !== null){
      //editamos
      this._productoService.editarProducto(this.id, PRODUCTO).subscribe(data=>{
        this.toastr.info('EL producto fue actualizado con exito!', 'Producto Actualizado!');
        this.router.navigate(['/']);
      })
      
    } else{
      //agregamos
      console.log(PRODUCTO);
    this._productoService.guardarProducto(PRODUCTO).subscribe(data => {
      this.toastr.success('El producto fue registrado con exito!', 'Producto Registrado!');
      this.router.navigate(['/']);
    }, error => {
      console.log(error);
      this.productoForm.reset();
    })

    }


    

  
  }

  esEditar() {

    if(this.id !== null) {
      this.titulo = 'Editar producto';
      this._productoService.obtenerProducto(this.id).subscribe(data => {
        this.productoForm.setValue({
          producto: data.nombre,
          codigo: data.codigo,
          peso: data.peso,
          precio: data.precio,
        })
      })
    }
  }

}
