import { Component, OnInit } from '@angular/core';
import { inmueble } from 'src/app/interfaces/inmueble';
import { InmuebleRegistroService } from 'src/app/services/inmueble.service';
import { SessionService } from 'src/app/services/session.service';

@Component({
  selector: 'app-detalle',
  templateUrl: './detalle.page.html',
  styleUrls: ['./detalle.page.scss'],
})
export class DetallePage implements OnInit {
  correo: string = ''
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
     private sessionService: SessionService
   ) { }
 
   ngOnInit() {
     this.sessionService.get('correo')?.then(correo => {
      this.correo = correo
     })
     
   }

  actualizarInmueble(){
    this.inmuebleRegistroService.postInmueble(this.inmueble).subscribe(res => console.log(res))
  }
  
  
}
