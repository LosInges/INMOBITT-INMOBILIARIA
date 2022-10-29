import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InmueblesPageRoutingModule } from './inmuebles-routing.module';

import { InmueblesPage } from './inmuebles.page';
import { ServicioComponent } from './servicio/servicio.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InmueblesPageRoutingModule
  ],
  declarations: [InmueblesPage, ServicioComponent]
})
export class InmueblesPageModule {}
