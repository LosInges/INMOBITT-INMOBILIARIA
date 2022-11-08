import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Inmobiliaria } from '../interfaces/inmobiliaria';
import { EstadosService } from '../services/estados.service';
import { InmobiliariaService } from '../services/inmobiliaria.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  inmobiliaria: Inmobiliaria = {
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
    private sessionService: SessionService,
    private inmobiliariaService: InmobiliariaService,
    private router:  Router
  ) { }

  ngOnInit() {
    this.sessionService.get('correo')?.then(correo => {
      if(correo) this.inmobiliariaService.getInmobiliaria(correo).subscribe(inmobiliaria => {
        this.inmobiliaria = inmobiliaria
      })
    })
  }

  actualizarPerfil() { 
    if (
      this.inmobiliaria.correo.trim() !== "" &&
      this.inmobiliaria.nombre.trim() !== "" &&
      this.inmobiliaria.password.trim() !== "" &&
      this.confirmPassword.trim() !== ""
    ) {
      if (this.confirmPassword === this.inmobiliaria.password)
      this.inmobiliariaService.postInmobiliaria(this.inmobiliaria).subscribe(res => console.log(res))
    }
  }

  eliminarPerfil(){
    if (this.confirmPassword === this.inmobiliaria.password)
    this.inmobiliariaService.deleteInmobiliaria(this.inmobiliaria.correo).subscribe(res => {
      if(res.results)
      this.sessionService.clear().then(()=>this.router.navigate([""]))
      else console.log(res)
    })

  }

}
