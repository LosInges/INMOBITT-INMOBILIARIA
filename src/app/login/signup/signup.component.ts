
import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Agente } from 'src/app/interfaces/agente';
import { Inmobiliaria } from 'src/app/interfaces/inmobiliaria';
import { AgenteService } from 'src/app/services/agente.service';
import { EstadosService } from 'src/app/services/estados.service';
import { InmobiliariaService } from 'src/app/services/inmobiliaria.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  apellidoPat: string = ''
  apellidoMat: string = ''
  inmobiliarias: Inmobiliaria[]
  agente: Agente = {
    rfc: '',
    inmobiliaria: '',
    nombre: '',
    correo: '',
    password: '',
    nombre: '',
    estado: '',
    direccion: {
      calle: '',
      codigopostal: '',
      colonia: '',
      numeroexterior: '',
      numerointerior: '',
      estado: '',
    },
    notarios: [],
    agentes: []
  };
  confirmPassword = '';

  estados = this.estadosService.getEstados();

  constructor(
    private estadosService: EstadosService,
    private inmobiliariaService: InmobiliariaService,
    private agenteService: AgenteService,
    private modalController: ModalController
  ) { }

  ngOnInit() {
    this.inmobiliariaService.getInmobiliarias()?.subscribe(inmobiliarias => {
      this.inmobiliarias = inmobiliarias
    })
  }

  onSubmit() {
    if (this.confirmPassword === this.agente.password){
      this.agente.apellido = this.apellidoPat +' '+ this.apellidoMat;    
      this.agenteService.postAgente(this.agente).subscribe(res => {
            console.log(res)
            if(res.results) this.modalController.dismiss()
            else console.log(res)
          })
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
    this.modalController.dismiss()
  }
}
