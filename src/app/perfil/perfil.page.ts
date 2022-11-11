import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Agente } from 'src/app/interfaces/agente';
import { Inmobiliaria } from '../interfaces/inmobiliaria';
import { AgenteService } from '../services/agente.service';
import { InmobiliariaService } from '../services/inmobiliaria.service';
import { SessionService } from '../services/session.service';

@Component({
  selector: 'app-perfil',
  templateUrl: './perfil.page.html',
  styleUrls: ['./perfil.page.scss'],
})
export class PerfilPage implements OnInit {

  apellidoPat: string = ''
  apellidoMat: string = ''
  inmobiliarias: Inmobiliaria[]

  agente: Agente = {
    rfc: '',
    inmobiliaria: '',
    nombre: '',
    correo: '',
    password: '',
    apellido: '',
    telefono: '',
    foto: ''
  };
  confirmPassword = '';

  constructor(
    private sessionService: SessionService,
    private inmobiliariaService: InmobiliariaService,
    private agenteService: AgenteService,
    private router:  Router
  ) { }

  ngOnInit() {
    this.sessionService.get('rfc')?.then(rfc => {
      if(rfc) this.agenteService.getAgente(rfc).subscribe(agente => {
        this.agente = agente
        this.apellidoPat = agente.apellido.split(" ")[0]
        this.apellidoMat = agente.apellido.split(" ")[1]
      })
    })
    this.inmobiliariaService.getInmobiliarias()?.subscribe(inmobiliarias => {
      this.inmobiliarias = inmobiliarias
    })
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
      if (this.confirmPassword === this.agente.password)
      {
        this.agente.apellido = this.apellidoPat +' '+ this.apellidoMat;  
        this.agenteService.postAgente(this.agente).subscribe(res => console.log(res))
      }
    //}
  }

  eliminarPerfil(){
    if (this.confirmPassword === this.agente.password)
    this.agenteService.deleteAgente(this.agente.rfc).subscribe(res => {
      if(res.results)
      this.sessionService.clear().then(()=>this.router.navigate([""]))
      else console.log(res)
    })

  }

}
