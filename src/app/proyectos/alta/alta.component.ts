import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Proyecto } from 'src/app/interfaces/proyecto';
import { ProyectosService } from 'src/app/services/proyectos.service';

@Component({
  selector: 'app-alta',
  templateUrl: './alta.component.html',
  styleUrls: ['./alta.component.scss'],
})
export class AltaComponent implements OnInit {
  @Input() inmobiliaria: string;
  @Input() estados: string[] = [];
  proyecto: Proyecto = {
    inmobiliaria: '',
    nombre: '',
    ciudad: '',
    inicio: new Date().toISOString(),
  };

  constructor(
    private modalController: ModalController,
    private proyectosService: ProyectosService
  ) {}

  ngOnInit() {
    this.proyecto.inmobiliaria = this.inmobiliaria;
  }

  registrarProyecto() {
    this.proyectosService.postProyecto(this.proyecto).subscribe((datos) => {
      if (datos.results) {
        this.modalController.dismiss({ ok: true });
      } else {
        console.log(datos);
      }
    });
  }
  cerrar() {
    this.modalController.dismiss();
  }
}
