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
    const redondeado = Math.ceil(multi * 1000);
    const dosD = String(redondeado).substring(0, 2);
    const tresD = String(redondeado).substring(0, 3);
    const numeroStr = multi.toString();
    const partes = numeroStr.split('.');
    const parteEntera = partes[0];
    const parteDecimal = partes[1] || '';

    if (parteDecimal.length >= 3) {
      const tercerDecimal = parseInt(parteDecimal[2], 10);
        if (tercerDecimal >= 5) {
          const segundoDecimal = parseInt(parteDecimal[1], 10);
          const nuevoSegundoDecimal = (segundoDecimal + 1) % 10;
          const primerDecimal = parseInt(parteDecimal[0], 10);
          const nuevoprimerDecimal = primerDecimal + (segundoDecimal + 1 >= 10 ? 1 : 0);
          // Construir el nuevo número con el segundo decimal ajustado
          let resultado = `26${codigo}000${parteEntera}${nuevoprimerDecimal}${nuevoSegundoDecimal}`;
          // Controlar que el resultado no tenga más de 13 dígitos
            if (resultado.length > 13) {
              resultado = resultado.substring(0, 11);
            }
          // Calcular y agregar el último dígito utilizando calcularUltimoDigito
          const codigoConUltimoDigito = calcularUltimoDigito(resultado);
          return `26${codigo}000${parteEntera}${nuevoprimerDecimal}${nuevoSegundoDecimal}${codigoConUltimoDigito}`;
        }
    }
    // Controlar que el resultado no tenga más de 13 dígitos
    if (`26${codigo}000${tresD}`.length > 13) {
      return `26${codigo}000${tresD}`.substring(0, 13);
    }
    // Calcular y agregar el último dígito utilizando calcularUltimoDigito
    const codigoConUltimoDigito = calcularUltimoDigito(`26${codigo}000${tresD}`);
    return `26${codigo}000${tresD}${codigoConUltimoDigito}`;
  }
  mostrarVentanaEmergente(urlImagen: string): void {
    window.open(urlImagen, 'Codigo de Barras', 'width=400,height=400');
  }
}


  function calcularUltimoDigito(codigoBarras: string): number {
    // Verificar que el código de barras tenga 12 caracteres
    if (codigoBarras.length !== 12) {
      throw new Error("El código de barras debe tener 12 caracteres.");
    }
  
    // Convertir el código de barras en un arreglo de números
    const numeros = codigoBarras.split("").map((char) => parseInt(char, 10));
  
    // Sumar todos los dígitos en las posiciones pares (0-indexed)
    let sumaPares = 0;
    for (let i = 0; i < numeros.length; i++) {
      if (i % 2 === 0) {
        sumaPares += numeros[i];
      }
    }
  
    // Sumar todos los dígitos en las posiciones impares (0-indexed)
    let sumaImpares = 0;
    for (let i = 0; i < numeros.length; i++) {
      if (i % 2 === 1) {
        sumaImpares += numeros[i];
      }
    }
  
    // Multiplicar por 3 el valor obtenido en la suma de los dígitos impares
    const multiplicadoPorTres = sumaImpares * 3;
  
    // Sumar este valor más la suma de los pares
    const sumaTotal = multiplicadoPorTres + sumaPares;
  
    // Redondear el valor obtenido a la decena inmediatamente superior
    const redondeado = Math.ceil(sumaTotal / 10) * 10;
  
    // Calcular el dígito de control restando la suma total del redondeo
    const digitoControl = redondeado - sumaTotal;
  
    return digitoControl;
  }


