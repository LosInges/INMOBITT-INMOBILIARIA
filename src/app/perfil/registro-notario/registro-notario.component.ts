import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Notario } from 'src/app/interfaces/notario';
import { FotoService } from 'src/app/services/foto.service';

@Component({
  selector: 'app-registro-notario',
  templateUrl: './registro-notario.component.html',
  styleUrls: ['./registro-notario.component.scss'],
})
export class RegistroNotarioComponent implements OnInit {
  @Input() api: string;

  apellidoPat = '';
  apellidoMat = '';

  notario: Notario = {
    nombre: '',
    apellido: '',
    correo: '',
    foto: '',
  };

  constructor(
    private fotoService: FotoService,
    private modalController: ModalController
  ) {}

  ngOnInit() {}

  onSubmit() {
    this.modalController.dismiss(this.notario);
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
