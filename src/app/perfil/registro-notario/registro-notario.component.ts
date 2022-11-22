import { AlertController, ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

import { FotoService } from 'src/app/services/foto.service';
import { LoginService } from 'src/app/services/login.service';
import { Notario } from 'src/app/interfaces/notario';
import { NotarioService } from 'src/app/services/notario.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro-notario',
  templateUrl: './registro-notario.component.html',
  styleUrls: ['./registro-notario.component.scss'],
})
export class RegistroNotarioComponent implements OnInit {
  @Input() api: string;
  @Input() inmobiliaria: string;

  apellidoPat = '';
  apellidoMat = '';

  notario: Notario = {
    inmobiliaria: '',
    rfc: '',
    nombre: '',
    apellido: '',
    correo: '',
    foto: '',
  };

  constructor(
    private fotoService: FotoService,
    private notarioService: NotarioService,
    private modalController: ModalController,
    private loginService: LoginService,
    private alertCtrl: AlertController,
    private router: Router
  ) {}

  ngOnInit() {
    this.notario.inmobiliaria = this.inmobiliaria;
  }

  onSubmit() {
    this.notario.apellido = this.apellidoPat + ' ' + this.apellidoMat;
    if (
      this.notario.nombre.trim().length > 0 &&
      this.notario.correo.trim().length > 0 &&
      this.notario.rfc.trim().length > 0 &&
      this.notario.apellido.trim().length > 0
    ) {
      // if (this.confirmPassword === this.notario.password) {
      if (
        this.notario.correo.match(
          '^[_A-Za-z0-9-\\+]+(\\.[_A-Za-z0-9-]+)*@' +
            '[A-Za-z0-9-]+(\\.[A-Za-z0-9]+)*(\\.[A-Za-z]{2,})$'
        )
      )
        this.loginService
          .solicitarRegistroNotario(this.notario.inmobiliaria, this.notario.rfc)
          .subscribe((solicitud) => {
            if (solicitud.permiso) {
              this.notarioService.postNotario(this.notario).subscribe((res) => {
                if (res.results) {
                  this.modalController.dismiss({ registrado: true });
                } else {
                  console.log(res);
                }
              });
            } else {
              this.mostrarAlerta(
                'Error:',
                'RFC ya registrado',
                'Favor de introducir otro RFC.'
              );
            }
          });
    } else {
      this.mostrarAlerta(
        'Error',
        'Campos vacios',
        'No deje espacios en blanco.'
      );
    }
  }
  async mostrarAlerta(titulo: string, subtitulo: string, mensaje: string) {
    const alert = await this.alertCtrl.create({
      header: titulo,
      subHeader: subtitulo,
      message: mensaje,
      buttons: ['OK'],
    });
    await alert.present();
    const result = await alert.onDidDismiss();
    console.log(result);
    this.router.navigate(['/', 'login']);
  }

  cerrar() {
    this.notario.apellido = this.apellidoPat + ' ' + this.apellidoMat;
    this.modalController.dismiss();
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
