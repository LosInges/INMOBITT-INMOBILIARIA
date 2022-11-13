import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Agente } from 'src/app/interfaces/agente';
import { Estado } from 'src/app/interfaces/estado';
import { AgenteService } from 'src/app/services/agente.service';
import { FotoService } from 'src/app/services/foto.service';

@Component({
  selector: 'app-registro-agente',
  templateUrl: './registro-agente.component.html',
  styleUrls: ['./registro-agente.component.scss'],
})
export class RegistroAgenteComponent implements OnInit {
  @Input() inmobiliaria = '';
  @Input() estados: Estado[];
  @Input() api: string;

  apellidoPat = '';
  apellidoMat = '';
  confirmPassword = '';

  agente: Agente = {
    rfc: '',
    inmobiliaria: '',
    nombre: '',
    correo: '',
    password: '',
    apellido: '',
    telefono: '',
    foto: '',
  };

  constructor(
    private agenteService: AgenteService,
    private fotoService: FotoService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    this.agente.inmobiliaria = this.inmobiliaria;
  }

  onSubmit() {
    if (this.confirmPassword === this.agente.password) {
      this.agente.apellido = this.apellidoPat + ' ' + this.apellidoMat;
      this.agenteService.postAgente(this.agente).subscribe((res) => {
        console.log(res);
        if (res.results) {
          this.modalController.dismiss();
        } else {
          console.log(res);
        }
      });
    }
    // if (
    //   this.agente.rfc.trim() &&
    //   this.agente.inmobiliaria.trim() &&
    //   this.agente.nombre.trim() &&
    //   this.agente.correo.trim() &&
    //   this.agente.password.trim() &&
    //   this.agente.apellido.trim() &&
    //   this.agente.foto.trim() &&
    //   this.agente.telefono.trim() &&
    //   this.confirmPassword.trim()
    // ) {
    // }
  }
  cerrar() {
    this.modalController.dismiss(this.agente);
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
          .subscribe((res) => (this.agente.foto = res.path));
      };
      fetch(photo.webPath).then((v) =>
        v.blob().then((imagen) => reader.readAsArrayBuffer(imagen))
      );
    });
  }
}
