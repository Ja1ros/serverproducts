import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { HttpClient } from '@angular/common/http';
import { CodigoBarrasService } from 'src/app/services/codigo.service';


@Component({
  selector: 'app-listar-producto',
  templateUrl: './listar-producto.component.html',
  styleUrls: ['./listar-producto.component.css']
})
export class ListarProductosComponent implements OnInit {
  listProductos: Producto[] = [];
  busqueda: string = '';
  filtrarProductos: Producto[] = []; // Productos filtrados
  todosLosProductos: Producto[] = []; // Mantén una copia de seguridad de todos los productos
  productoSeleccionado: any = null;
  busquedaInicial: string = '';
  busquedaActual: string = '';

  tresD: any;
   get productosFiltrados() {
    return this.listProductos.filter((producto) =>
      producto.nombre.toLowerCase().includes(this.busqueda.toLowerCase())
    );
  }
  
  constructor(private _productoService: ProductoService,
        private toastr: ToastrService,
        private http: HttpClient,
        private codigoBarrasService: CodigoBarrasService) { }

  ngOnInit(): void {
    this.obtenerProductos();
    this.busquedaInicial = this.busqueda;
    this.busquedaActual = this.busqueda;
    this.actualizarProductosFiltrados();
  }

  obtenerProductos() {
    this._productoService.getProductos().subscribe(data => {
      console.log(data);
      this.listProductos = data;
      
    }, error => {
      console.log(error);
    })
  }

  editarProducto(producto: any) {
    this.productoSeleccionado = producto;
    this.busquedaInicial = this.busqueda; // Guarda la búsqueda actual antes de editar
}

  guardarCambios() {
    if (this.productoSeleccionado) {
      // Llama al servicio para actualizar el producto editado
      this._productoService.actualizarProducto(this.productoSeleccionado).subscribe(
        () => {
           // Restaura la búsqueda inicial después de la edición
        this.busqueda = this.busquedaInicial;
        
        // Actualiza la lista de productos filtrados
        this.actualizarProductosFiltrados();

          // Restablece productoSeleccionado a null para salir del modo de edición
          this.productoSeleccionado = null;
        },
        error => {
          console.error('Error al guardar los cambios', error);
          // Maneja el error si es necesario
        }
      );
    }
  }
  actualizarProductosFiltrados() {
    this.filtrarProductos = this.listProductos.filter((producto) =>
    producto.nombre.toLowerCase().includes(this.busquedaActual.toLowerCase())
  );
  }
  
  actualizarBusqueda(nuevaBusqueda: string) {
    this.busquedaActual = nuevaBusqueda;
    this.actualizarProductosFiltrados();
  }
  

  eliminarProducto(id: any) {
    if(confirm('Esta seguro de eliminar este producto?')){
      this._productoService.eliminarProducto(id).subscribe(data => {
        this.toastr.error('El producto fue eliminado con exito' ,'Producto Eliminado');
        this.obtenerProductos();
    }, error => {
      console.log(error);
    
    });
    }
  }

  generarCodigoBarras(codigo: string, peso: number, precio: number): string {
    return this.codigoBarrasService.calcularCodigoBarras(codigo, peso, precio);
  }

}

  