export class Producto {
    _id?: number;
    nombre: string;
    codigo: string;
    peso: number;
    precio: number;

    constructor(nombre: string,codigo: string, peso: number, precio: number){
        this.nombre = nombre;
        this.codigo = codigo;
        this.peso = peso;
        this.precio = precio;
    }
}