import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InmueblesPageRoutingModule } from './inmuebles-routing.module';

import { InmueblesPage } from './inmuebles.page';
import { AltaComponent } from './alta/alta.component';
import { AgentesNotariosComponent } from './agentes-notarios/agentes-notarios.component';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InmueblesPageRoutingModule
  ],
  declarations: [InmueblesPage, AltaComponent, AgentesNotariosComponent]
})
export class InmueblesPageModule {}
