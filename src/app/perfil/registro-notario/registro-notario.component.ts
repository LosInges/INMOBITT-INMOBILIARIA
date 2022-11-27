import { AlertController, ModalController } from '@ionic/angular';
import { Component, Input, OnInit } from '@angular/core';

import { FotoService } from 'src/app/services/foto.service';
import { Notario } from 'src/app/interfaces/notario';
import { NotarioService } from 'src/app/services/notario.service';

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
    private alertCtrl: AlertController,
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
      ) {
        this.notarioService.postNotario(this.notario).subscribe((res) => {
          if (res.results) {
            this.mostrarAlerta(
              'Registro exitoso',
              'Notario registrado',
              'El notario se ha registrado correctamente'
            );
            this.modalController.dismiss({ registrado: true });
          } else {
            console.log(res);
            this.mostrarAlerta(
              'Error',
              'No se pudo registrar',
              'El notario no se pudo registrar'
            );
          }
        });
      } else {
        this.mostrarAlerta(
          'Error:',
          'Formato correo no válido',
          'Favor de introducir un correo válido.'
        );
      }
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
    return alert.present();
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
