import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Inmobiliaria } from 'src/app/interfaces/inmobiliaria';
import { EstadosService } from 'src/app/services/estados.service';
import { InmobiliariaService } from 'src/app/services/inmobiliaria.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  inmobiliaria: Inmobiliaria = {
    correo: '',
    password: '',
    nombre: '',
    estado: '',
    foto: '',
    direccion: {
      calle: '',
      codigopostal: '',
      colonia: '',
      numeroexterior: '',
      numerointerior: '',
      estado: '',
    },
    sedes: [],
  };
  confirmPassword = '';

  estados = this.estadosService.getEstados();

  constructor(
    private estadosService: EstadosService,
    private inmobiliariaService: InmobiliariaService,
    private modalController: ModalController
  ) {}

  ngOnInit() {
    console.log(this.estados);
  }

  onSubmit() {
    if (
      this.inmobiliaria.correo.trim() !== '' &&
      this.inmobiliaria.nombre.trim() !== '' &&
      this.inmobiliaria.password.trim() !== '' &&
      this.confirmPassword.trim() !== ''
    ) {
      if (this.confirmPassword === this.inmobiliaria.password) {
        this.inmobiliariaService
          .postInmobiliaria(this.inmobiliaria)
          .subscribe((res) => {
            if (res.results) {
              this.modalController.dismiss();
            } else {
              console.log(res);
            }
          });
      }
    }
  }
  cerrar() {
    this.modalController.dismiss();
  }
}
