import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PerfilPageRoutingModule } from './perfil-routing.module';

import { PerfilPage } from './perfil.page';
import { AgentesComponent } from './agentes/agentes.component';
import { NotariosComponent } from './notarios/notarios.component';
import { RegistroAgenteComponent } from './registro-agente/registro-agente.component';
import { RegistroNotarioComponent } from './registro-notario/registro-notario.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PerfilPageRoutingModule
  ],
  declarations: [PerfilPage, AgentesComponent, NotariosComponent, RegistroAgenteComponent, RegistroNotarioComponent]
})
export class PerfilPageModule {}
