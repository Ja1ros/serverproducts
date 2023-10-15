import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {
  //url = 'http://localhost:4000/api/productos/';
  url = 'https://server-products-pngg.onrender.com/api/productos/';

  constructor(private http: HttpClient) { }

  getProductos(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url);
  }

  eliminarProducto(id: string): Observable<any> {
    return this.http.delete(`${this.url}${id}`);
  }

  guardarProducto(producto: Producto): Observable<Producto> {
    return this.http.post<Producto>(this.url, producto);
  }

  actualizarProducto(producto: Producto): Observable<any> {
    const url = `${this.url}/productos/${producto._id}`; // Reemplaza '_id' con el campo que identifica al producto
    return this.http.put(url, producto); // Envía una solicitud PUT al servidor para actualizar el producto
  }

  obtenerProducto(id: string): Observable<Producto> {
    return this.http.get<Producto>(`${this.url}${id}`);
  }

  editarProducto(id: string, producto: Producto): Observable<Producto> {
    return this.http.put<Producto>(`${this.url}${id}`, producto);
  }
}
