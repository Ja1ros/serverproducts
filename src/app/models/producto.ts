export class Producto {
    _id?: number;
    nombre: string;
    codigo: number;
    precio: number;

    constructor(nombre: string,codigo: number,precio: number){
        this.nombre = nombre;
        this.codigo = codigo;
        this.precio = precio;
    }
}