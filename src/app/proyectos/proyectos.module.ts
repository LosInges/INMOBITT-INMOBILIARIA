import { AltaComponent } from './alta/alta.component';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { ProyectosPage } from './proyectos.page';
import { ProyectosPageRoutingModule } from './proyectos-routing.module';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ProyectosPageRoutingModule
  ],
  declarations: [
    ProyectosPage,
    AltaComponent
  ]
})
export class ProyectosPageModule {}
