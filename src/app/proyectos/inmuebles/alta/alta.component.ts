import { AlertController, ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

import { Agente } from 'src/app/interfaces/agente';
import { FotoService } from 'src/app/services/foto.service';
import { Inmueble } from 'src/app/interfaces/inmueble';
import { InmuebleService } from 'src/app/services/inmueble.service';
import { Notario } from 'src/app/interfaces/notario';
import { environment } from 'src/environments/environment';

/* eslint-disable @typescript-eslint/naming-convention */

@Component({
  selector: 'app-alta',
  templateUrl: './alta.component.html',
  styleUrls: ['./alta.component.scss'],
})
export class AltaComponent implements OnInit {
  @Input() proyecto: string;
  @Input() estado: string;
  @Input() inmobiliaria: string;
  @Input() agentes: Agente[] = [];
  @Input() notarios: Notario[] = [];
  @Input() servicios: string[] = [];

  venta = false;
  renta = false;
  api = environment.api;

  inmueble: Inmueble = {
    inmobiliaria: '',
    proyecto: '',
    titulo: '',
    estado: '',
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
    foto: '',
    metros_cuadrados: 0,
    notario: '',
    pisos: 1,
    precio_renta: 0,
    precio_venta: 0,
    servicios: [],
    agente: '',
    borrado: false,
    visible: true,
  };

  constructor(
    private inmuebleService: InmuebleService,
    private modalController: ModalController,
    private fotoService: FotoService,
    private alertConttroller: AlertController
  ) {}

  ngOnInit() {
    this.inmueble.inmobiliaria = this.inmobiliaria;
    this.inmueble.proyecto = this.proyecto;
    this.inmueble.estado = this.estado;
  }

  registrarInmueble() {
    this.inmuebleService.postInmueble(this.inmueble).subscribe((val) => {
      if (val.results) {
        this.alertConttroller
          .create({
            header: 'ÉXITOSAME',
            message: 'Se registró INMUEBLE',
            buttons: ['CERRAR'],
          })
          .then((alert) => {
            alert.present();
          });

        this.modalController.dismiss({ ok: true });

        return;
      }
      this.alertConttroller
        .create({
          header: 'ERROR',
          message: 'Inmueble  NO registrado',
          buttons: ['CERRAR'],
        })
        .then((alert) => {
          alert.present();
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

  cerrar() {
    this.modalController.dismiss();
  }
}
