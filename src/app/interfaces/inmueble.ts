import { Direccion } from "./direccion";
import { Notario } from "./notario";

export interface inmueble{
    titulo: string;
    estado: string; 
    cuartos: number; 
    descripcion: string; 
    direccion: Direccion; 
    foto: string;
    metros_cuadrados: string;
    notarios: Notario;
    pisos: number;
    precio_renta: number;
    precio_venta: number; 
    servicios: string; 
    agente: string;
    borrado: false;
    visible: true
}