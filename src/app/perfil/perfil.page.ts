import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { FotoService } from '../services/foto.service';
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
  api = environment.api
  inmobiliarias: Inmobiliaria[]

  inmobiliaria: Inmobiliaria = {
    correo: '',
    password: '',
    nombre: '',
    foto: '',
    estado: '',
    direccion: {
      calle: '',
      codigopostal: '',
      colonia: '',
      numeroexterior: '',
      numerointerior: '',
      estado: '',
    },
    sedes: [],
    notarios: [],
    agentes: [], 
  };
  confirmPassword = '';

  estados = this.estadosService.getEstados();
  constructor(
    private estadosService: EstadosService,
    private sessionService: SessionService,
    private inmobiliariaService: InmobiliariaService,
    private fotoService: FotoService,
    private router:  Router
  ) { }

  ngOnInit() {
    this.sessionService.get('correo')?.then(correo => {
      if(correo) this.inmobiliariaService.getInmobiliaria(correo).subscribe(inmobiliaria => {
        this.inmobiliaria = inmobiliaria
        console.log(inmobiliaria)
      })
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
      if (this.confirmPassword === this.inmobiliaria.password)
      {
        this.inmobiliariaService.postInmobiliaria(this.inmobiliaria).subscribe(res => console.log(res))
      }
    //}
  }

  eliminarPerfil(){
    if (this.confirmPassword === this.inmobiliaria.password)
    this.inmobiliariaService.deleteInmobiliaria(this.inmobiliaria.correo).subscribe(res => {
      if(res.results)
      this.sessionService.clear().then(()=>this.router.navigate([""]))
      else console.log(res)
    })

  }

  tomarFotografia() {
    this.fotoService.tomarFoto().then((photo) => {
      // this.fotoService.subirMiniatura(photo.webPath).subscribe((data) => {
      //   console.log(data);
      // });
      const reader = new FileReader();
      const datos = new FormData();
      reader.onload = () => {
        const imgBlob = new Blob([reader.result], {
          type: `image/${photo.format}`,
        });
        datos.append('img', imgBlob, `imagen.${photo.format}`);
        this.fotoService
          .subirMiniatura(datos)
          .subscribe((res) =>
          this.inmobiliaria.foto = res.path
          );
      };
      const consulta = fetch(photo.webPath).then((v) =>
        v.blob().then((imagen) => reader.readAsArrayBuffer(imagen))
      );
    });
  }

}
