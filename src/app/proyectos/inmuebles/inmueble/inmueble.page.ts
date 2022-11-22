/* eslint-disable @typescript-eslint/naming-convention */

import { AlertController, ModalController } from '@ionic/angular';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute } from '@angular/router';
import { Agente } from 'src/app/interfaces/agente';
import { AgenteService } from 'src/app/services/agente.service';
import { Direccion } from 'src/app/interfaces/direccion';
import { FotoService } from 'src/app/services/foto.service';
import { Imagen } from 'src/app/interfaces/imagen';
import { Inmueble } from 'src/app/interfaces/inmueble';
import { InmuebleService } from 'src/app/services/inmueble.service';
import { MapsComponent } from 'src/app/maps/maps.component';
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
  proyecto: string = this.activatedRoute.snapshot.paramMap.get('proyecto');
  inmobiliaria: string;
  imagenes: Imagen[] = [];
  inmuebles: Inmueble[] = [];
  clientes: string[] = [];
  venta = false;
  renta = false;
  api = environment.api;
  servicios = this.servicio.getServicios();
  notario: Notario = {
    inmobiliaria: '',
    rfc: '',
    nombre: '',
    apellido: '',
    correo: '',
    foto: '',
  };

  agente: Agente = {
    rfc: '',
    inmobiliaria: '',
    correo: '',
    password: '',
    nombre: '',
    apellido: '',
    telefono: '',
    foto: '',
  };

  inmueble: Inmueble = {
    inmobiliaria: '',
    proyecto: '',
    agente: '',
    borrado: false,
    cuartos: 1,
    descripcion: '',
    direccion: {
      lat: 0,
      lng: 0,
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
    private agenteService: AgenteService,
    private notarioService: NotarioService,
    private activeRoute: ActivatedRoute,
    private fotoService: FotoService,
    private servicio: ServiciosService,
    private activatedRoute: ActivatedRoute,
    private alertConttroller: AlertController,
    private modalController: ModalController
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
            this.agenteService
              .getAgente(inmobiliaria, inmueble.agente)
              .subscribe((agente) => (this.agente = agente));
            this.notarioService
              .getNotario(inmobiliaria, inmueble.notario)
              .subscribe((notario) => (this.notario = notario));
            this.inmuebleService
              .getClientesInmueble(
                inmueble.inmobiliaria,
                inmueble.proyecto,
                inmueble.titulo
              )
              .subscribe((clientes) => {
                this.clientes = [];
                clientes.forEach((cliente) =>
                  this.clientes.push(cliente.cliente)
                );
                console.log(this.clientes);
              });
            this.inmuebleService
              .getFotos(
                inmueble.inmobiliaria,
                inmueble.proyecto,
                inmueble.titulo
              )
              .subscribe((imagenes) => (this.imagenes = imagenes));
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

  agregarFotoGaleria() {
    this.fotoService.tomarFoto().then((photo) => {
      const reader = new FileReader();
      const datos = new FormData();
      reader.onload = () => {
        const imgBlob = new Blob([reader.result], {
          type: `image/${photo.format}`,
        });
        datos.append('img', imgBlob, `imagen.${photo.format}`);
        this.fotoService.subirImg(datos).subscribe((res) => {
          const imagen = {
            inmobiliaria: this.inmueble.inmobiliaria,
            proyecto: this.inmueble.proyecto,
            titulo: this.inmueble.titulo,
            ruta: res.path,
          };
          this.inmuebleService.postFotos(imagen).subscribe((val) => {
            if (val.results) {
              this.imagenes.push(imagen);
            }
          });
        });
      };
      fetch(photo.webPath).then((v) =>
        v.blob().then((imagen) => reader.readAsArrayBuffer(imagen))
      );
    });
  }

  actualizar() {
    if (!this.venta) {
      this.inmueble.precio_venta = 0;
    }
    if (!this.renta) {
      this.inmueble.precio_renta = 0;
    }
    this.inmuebleService.postInmueble(this.inmueble).subscribe((res) => {
      if (res.results) {
        this.alertConttroller
          .create({
            header: 'ÉXITOSAME',
            message: 'SE ACTUALIZÓ EL INMUEBLE',
            buttons: ['CERRAR'],
          })
          .then((alert) => {
            alert.present();
          });
      } else {
        this.alertConttroller
          .create({
            header: 'ERROR',
            message: 'HUBO UN ERROR EN EL SERVIDOR',
            buttons: ['CERRAR'],
          })
          .then((alert) => {
            alert.present();
          });
      }
    });
  }

  eliminarInmueble(inmueble: Inmueble) {
    this.inmuebleService
      .getClientesInmueble(this.inmobiliaria, this.proyecto, inmueble.titulo)
      .subscribe((clientes) => {
        clientes.forEach((cliente) => {
          inmueble.cliente = cliente.cliente;
          this.inmuebleService.deleteInmuebleCliente(inmueble).subscribe(()=>{
          });
        });
        this.imagenes.forEach(imagen => this.inmuebleService.deleteImagen(imagen).subscribe(() => {}))
        this.inmuebleService.deleteInmueble(inmueble).subscribe((valor) => {
          if (valor.results) {
            this.inmuebles = this.inmuebles.filter(
              (inmuebleIterable) => inmueble !== inmuebleIterable
            );
            this.alertConttroller
              .create({
                header: 'ÉXITOSAME',
                message: 'Se ELIMINÓ INMUEBLE',
                buttons: ['CERRAR'],
              })
              .then((alert) => {
                alert.present();
              });
          } else {
            this.alertConttroller
              .create({
                header: 'ERROR',
                message: 'NO se ELIMINÓ el INMUEBLE',
                buttons: ['CERRAR'],
              })
              .then((alert) => {
                alert.present();
              });
            console.log(valor);
          }
        });
      });
  }

  async verPosicion(position: Direccion) {
    const modal = await this.modalController.create({
      component: MapsComponent,
      componentProps: { position },
      cssClass: 'modalGeneral',
    });
    return modal.present();
  }
  async guardarPosicion(position: Direccion) {
    const modal = await this.modalController.create({
      component: MapsComponent,
      componentProps: { position },
      cssClass: 'modalGeneral',
    });
    modal.onDidDismiss().then((res) => {
      if (res.data.pos) {
        this.inmueble.direccion = res.data.pos;
      }
    });
    return modal.present();
  }

  eliminar(imagen: Imagen) {
    this.alertConttroller
      .create({
        header: 'ALTO',
        subHeader:'¿Está seguro? ',
        message: '¿Desea eliminar la imagen?',
        buttons: [
          'NO',
          {
            text: 'SI',
            handler: () => {
              this.inmuebleService.deleteImagen(imagen).subscribe((val) => {
                if (val.results) {
                  this.imagenes = this.imagenes.filter((img) => img != imagen);
                }else{console.log(val);
                }
              });
            },
          },

        ],
      })
      .then((alert) => {
        alert.present();
      });
  }
}
