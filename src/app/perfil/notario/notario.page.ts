import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { Agente } from 'src/app/interfaces/agente';
import { AgenteService } from 'src/app/services/agente.service';
import { AlertController } from '@ionic/angular';
import { FotoService } from 'src/app/services/foto.service';
import { Inmobiliaria } from './../../interfaces/inmobiliaria';
import { Inmueble } from 'src/app/interfaces/inmueble';
import { InmuebleService } from 'src/app/services/inmueble.service';
import { Notario } from 'src/app/interfaces/notario';
import { NotarioService } from 'src/app/services/notario.service';
import { ProyectosService } from './../../services/proyectos.service';
import { SessionService } from 'src/app/services/session.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-notario',
  templateUrl: './notario.page.html',
  styleUrls: ['./notario.page.scss'],
})
export class NotarioPage implements OnInit {
  inmobiliaria: Inmobiliaria;
  apellidoPat = '';
  apellidoMat = '';
  api = environment.api;
  notario: Notario = {
    rfc: '',
    inmobiliaria: '',
    nombre: '',
    apellido: '',
    correo: '',
    foto: '',
  };
  confirmPassword = '';
  mensaje = '';


  constructor(
    private sessionService: SessionService,
    private notarioService: NotarioService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private fotoService: FotoService,
    private alertController: AlertController,
    private inmuebleService: InmuebleService,
    private proyectoService: ProyectosService
  ) {}

  ngOnInit() {
    this.sessionService.get('correo').then((inmobiliaria) => {
      if (inmobiliaria) {
        this.activatedRoute.params.subscribe((params) => {
          if (params.rfc) {
            this.notarioService
              .getNotario(inmobiliaria, params.rfc)
              .subscribe((notario) => {
                this.notario = notario;
                this.apellidoPat = notario.apellido.split(' ')[0];
                this.apellidoMat = notario.apellido.split(' ')[1];
              });
          }
        });
      }
    });
  }

  actualizarPerfil() {
    // if (
    //   this.agente.rfc.trim() !== "" &&
    //   this.agente.inmobiliaria.trim() !== "" &&
    //   this.agente.nombre.trim() !== "" &&
    //   this.agente.correo.trim() !== "" &&
    //   this.agente.password.trim() !== "" &&
    //   this.agente.apellido.trim() !== "" &&
    //   this.agente.foto.trim() !== "" &&
    //   this.agente.telefono.trim() !== "" &&
    //   this.confirmPassword.trim() !== ""
    // )
    //{

    this.notario.apellido = this.apellidoPat + ' ' + this.apellidoMat;
    this.notarioService
      .postNotario(this.notario)
      .subscribe((res) => console.log(res));
    this.mensaje = 'Actualización EXITOSA';

    this.presentAlert();
    //}
  }

  async presentAlert() {
    const alert = await this.alertController.create({
      header: this.mensaje,
      cssClass: 'custom-alert',
      buttons: [
        {
          text: 'NO',
          cssClass: 'alert-button-cancel',
        },
        {
          text: 'OK',
          cssClass: 'alert-button-confirm',
        },
      ],
    });

    await alert.present();
  }

  eliminarPerfil() {
    this.notarioService.getProyectos(this.notario.rfc).subscribe((proyectos) => {
      proyectos.forEach((proyecto) => {
        this.notarioService
          .getInmueblesProyectoNotario(
            this.notario.rfc,
            this.inmobiliaria.correo,
            proyecto.nombre
          )
          .subscribe((inmuebles) => {
            inmuebles.forEach((inmueble) => {
              this.eliminarInmueble(inmueble);
            });
          });
        this.eliminarNotarioProyecto(this.notario.rfc, proyecto.nombre);
      });
    });
    this.notarioService
      .deleteNotario(this.notario.inmobiliaria, this.notario.rfc)
      .subscribe((res) => {
        if (res.results) {
          this.router.navigate(['perfil']);
        } else {
          console.log(res);
        }
      });
  }

  eliminarNotarioProyecto(rfc: string, proyecto: string) {
    this.proyectoService
      .deleteNotarioProyecto({
        inmobiliaria: this.inmobiliaria.correo,
        nombre: proyecto,
        notario: rfc,
      })
      .subscribe((respuesta) => {
        console.log(respuesta);
      });
  }
  eliminarInmueble(inmueble: Inmueble) {
    this.inmuebleService
      .getClientesInmueble(
        inmueble.inmobiliaria,
        inmueble.proyecto,
        inmueble.titulo
      )
      .subscribe((clientes) => {
        clientes.forEach((cliente) => {
          inmueble.cliente = cliente;
          this.inmuebleService.deleteInmuebleCliente(inmueble);
        });
        this.inmuebleService.deleteInmueble(inmueble).subscribe((valor) => {
          console.log(valor);
        });
      });
  }


  tomarFotografia() {
    this.fotoService.tomarFoto().then((photo) => {
      // this.fotoService.subirMiniatura(photo.webPath).subscribe((data) => {
      //   console.log(data);
      // });
      console.log(photo);
      const reader = new FileReader();
      const datos = new FormData();
      reader.onload = () => {
        const imgBlob = new Blob([reader.result], {
          type: `image/${photo.format}`,
        });
        datos.append('img', imgBlob, `imagen.${photo.format}`);
        this.fotoService
          .subirImgMiniatura(datos)
          .subscribe((res) => (this.notario.foto = res.miniatura));
      };
      fetch(photo.webPath).then((v) =>
        v.blob().then((imagen) => reader.readAsArrayBuffer(imagen))
      );
    });
  }
}
