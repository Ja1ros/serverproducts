import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Producto } from 'src/app/models/producto';
import { ProductoService } from 'src/app/services/producto.service';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-listar-producto',
  templateUrl: './listar-producto.component.html',
  styleUrls: ['./listar-producto.component.css']
})
export class ListarProductosComponent implements OnInit {
  listProductos: Producto[] = [];
  
  constructor(private _productoService: ProductoService,
        private toastr: ToastrService,
        private http: HttpClient) { }

  ngOnInit(): void {
    this.obtenerProductos();
  }


  obtenerProductos() {
    this._productoService.getProductos().subscribe(data => {
      console.log(data);
      this.listProductos = data;
      
    }, error => {
      console.log(error);
    })
  }

  eliminarProducto(id: any) {
    this._productoService.eliminarProducto(id).subscribe(data => {
      this.toastr.error('El producto fue eliminado con exito' ,'Producto Eliminado');
      this.obtenerProductos();
    }, error => {
      console.log(error);
    })
  }

  generarCodigoBarras(codigo: string, peso: number, precio: number): string {
    const textoCodigoBarras = this.calcularCodigoBarras(codigo, peso, precio);

    // Genera una solicitud HTTP para obtener el código de barras generado
    const url = `https://bwipjs-api.metafloor.com/?bcid=code128&text=${encodeURIComponent(textoCodigoBarras)}`;
    
    return url;
  }

  

  calcularCodigoBarras(codigo: string, peso: number, precio: number): string {
    const multi = peso * precio;
    const tresPrimerosDigitos = String(multi).substring(0, 4);
    const resultadoSinPunto = tresPrimerosDigitos.replace('.', '');

    const ultimoDigitoP = Number(resultadoSinPunto.charAt(resultadoSinPunto.length - 1));
    let resultadoRedondeado: number;
    if (ultimoDigitoP >= 5) {
        resultadoRedondeado = parseInt(resultadoSinPunto) + 1;
    } else {
        resultadoRedondeado = parseInt(resultadoSinPunto);
    }

    const MMM = peso * precio + peso * precio + peso * precio;
    const redondeado = Math.round(MMM * 100); // Redondear a dos decimales
    const resultadoSinPuntoF = redondeado.toString();
    const ultimoDigito = Number(resultadoSinPuntoF.charAt(resultadoSinPuntoF.length - 1)); 
    return `26${codigo}000${resultadoRedondeado}${ultimoDigito}`;    
  }

  mostrarVentanaEmergente(urlImagen: string): void {
    window.open(urlImagen, 'Codigo de Barras', 'width=400,height=400');
  }

}

