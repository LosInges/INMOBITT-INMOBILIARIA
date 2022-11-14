import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Notario } from 'src/app/interfaces/notario';
import { FotoService } from 'src/app/services/foto.service';
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
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.notario.inmobiliaria = this.inmobiliaria;
  }

  onSubmit() {
    this.notario.apellido = this.apellidoPat + ' ' + this.apellidoMat;
    this.notarioService.postNotario(this.notario).subscribe((res) => {
      if (res.results) {
        this.modalController.dismiss({ registrado: true });
      } else {
        console.log(res);
      }
    });
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
