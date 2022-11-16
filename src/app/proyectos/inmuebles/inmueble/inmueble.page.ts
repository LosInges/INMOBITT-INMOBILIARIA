import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Agente } from 'src/app/interfaces/agente';
import { AgenteService } from 'src/app/services/agente.service';
import { FotoService } from 'src/app/services/foto.service';
import { InmobiliariaService } from 'src/app/services/inmobiliaria.service';
import { Inmueble } from 'src/app/interfaces/inmueble';
import { InmuebleService } from 'src/app/services/inmueble.service';
import { Notario } from 'src/app/interfaces/notario';
import { NotarioService } from 'src/app/services/notario.service';
import { ServiciosService } from 'src/app/services/servicios.service';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-inmueble',
  templateUrl: './inmueble.page.html',
  styleUrls: ['./inmueble.page.scss'],
})
export class InmueblePage implements OnInit {
  venta = false;
  renta = false;
  api = environment.api;
  servicios = this.servicio.getServicios();
  notario: Notario={
    inmobiliaria:"",
    rfc:"",
    nombre:"",
    apellido:"",
    correo:"",
    foto:"",

  };

  agente: Agente ={
    rfc:"",
    inmobiliaria:"",
    correo:"",
    password:"",
    nombre:"",
    apellido:"",
    telefono:"",
    foto:"",
  };

  inmueble: Inmueble = {
    inmobiliaria: '',
    proyecto: '',
    agente: '',
    borrado: false,
    cuartos: 1,
    descripcion: '',
    direccion: {
      calle: '',
      codigopostal: '',
      colonia: '',
      numeroexterior: '',
      numerointerior: '',
      estado: '',
    },
    estado: '',
    foto: '',
    metros_cuadrados: 0,
    notario: '',
    pisos: 1,
    precio_renta: 0,
    precio_venta: 0,
    servicios: [],
    titulo: '',
    visible: true,
  };

  constructor(
    private inmuebleService: InmuebleService,
    private sessionService: SessionService,
    private inmobiliariaService: InmobiliariaService,
    private agenteService: AgenteService,
    private notarioService:NotarioService,
    private activeRoute: ActivatedRoute,
    private fotoService: FotoService,
    private servicio: ServiciosService
  ) {}

  ngOnInit() {
    this.sessionService.get('correo').then((inmobiliaria) => {
      this.activeRoute.params.subscribe((params) => {
        this.inmuebleService
          .getInmueble(inmobiliaria, params.proyecto, params.titulo)
          .subscribe((inmueble) => {
            this.inmueble = inmueble;
            this.venta = inmueble.precio_venta > 0;
            this.renta = inmueble.precio_renta > 0;
            console.log(inmueble);
            this.agenteService.getAgente(inmobiliaria, inmueble.agente).subscribe(agente=>(this.agente = agente));
            this.notarioService.getNotario(inmobiliaria, inmueble.notario).subscribe(notario=>(this.notario = notario));
          });

      });
    });
  }

  tomarFotografia() {
    this.fotoService.tomarFoto().then((photo) => {
      const reader = new FileReader();
      const datos = new FormData();
      reader.onload = () => {
        const imgBlob = new Blob([reader.result], {
          type: `image/${photo.format}`,
        });
        datos.append('img', imgBlob, `imagen.${photo.format}`);
        this.fotoService.subirImgMiniatura(datos).subscribe((res) => {
          this.inmueble.foto = res.miniatura;
          console.log(this.api, this.inmueble.foto);
        });
      };
      fetch(photo.webPath).then((v) =>
        v.blob().then((imagen) => reader.readAsArrayBuffer(imagen))
      );
    });
  }

  actualizar() {
    this.inmuebleService
      .postInmueble(this.inmueble)
      .subscribe((res) => console.log(res));
  }
}
