import { Component, OnInit } from '@angular/core';
import { Estado } from 'src/app/interfaces/estado';
import { inmueble } from 'src/app/interfaces/inmueble';
import { EstadosService } from 'src/app/services/estados.service';
import { InmuebleRegistroService } from 'src/app/services/inmueble.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  estados: Estado[]=this.estadosService.getEstados()
  correo: string = ''
  inmobiliaria: string = ''
 inmueble : inmueble = {
  titulo: '',
  estado: '', 
  cuartos: 0, 
  descripcion: '', 
 
  direccion: {
    calle: '',
    codigopostal: '',
    colonia: '',
    numeroexterior: '',
    numerointerior: '',
    estado: '',
  },
  
  foto: '',
  metros_cuadrados: '',
  
  notarios: {
    nombre: '',
    apellido: '',
    correo: '',
    foto: ''
  },
  pisos: 0,
  precio_renta: 0,
  precio_venta: 0, 
  servicios: '', 
  agente: '',
  borrado: false,
  visible: true
 }

  constructor(
    private inmuebleRegistroService : InmuebleRegistroService,
    private sessionService : SessionService,
    private estadosService : EstadosService
  ) { }

  ngOnInit() {
    this.sessionService.get('correo')?.then(correo => {
     this.correo = correo
    })
  }

  registrarInmueble() {
    // this.inmuebleRegistroService.postInmueble(this.inmueble).subscribe((val)=>{
    //   console.log(val)
    // });
    console.log(this.inmueble)
  }

  
}
