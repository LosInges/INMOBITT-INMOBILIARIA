import { Component, Input, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Servicio } from 'src/app/interfaces/servicio';
import { ServiciosService } from 'src/app/services/servicios.service';

@Component({
  selector: 'app-servicio',
  templateUrl: './servicio.component.html',
  styleUrls: ['./servicio.component.scss'],
})
export class ServicioComponent implements OnInit {
  @Input() servicios: Servicio[];
  servicio: Servicio = {
    nombre: '',
  };

  constructor(private serviciosService: ServiciosService) {}

  ngOnInit() {}

  agregarServicio() {
    this.serviciosService.postServicio(this.servicio).subscribe((val) => {
      if (val.results) {
        this.servicios.push({ ...this.servicio });
      } else {
        console.log(val);
      }
    });
  }
}
