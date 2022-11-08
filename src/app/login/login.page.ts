import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  constructor(private modalController: ModalController) {}

  ngOnInit() {}

  async abrirRegistro(){
    const modal = await this.modalController.create({
      component: SignupComponent,
      cssClass: 'modalRegistrar'
    });
    return await modal.present();
  }

  async abrirIngresar(){
    const modal = await this.modalController.create({
      component: LoginComponent,
      cssClass: 'modalIngresar'
    });
    return await modal.present();
  }

}
