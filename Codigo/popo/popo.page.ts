import { Component, OnInit } from '@angular/core';
import { PopoverController, NavParams, LoadingController } from '@ionic/angular';
import * as firebase from 'firebase';

@Component({
  selector: 'app-popo',
  templateUrl: './popo.page.html',
  styleUrls: ['./popo.page.scss'],
})
export class PopoPage implements OnInit {
  texto;
  email;
  nombre;
  usuarios = [];
  usuario = [];
  keys= [];
  llaveUsuario;
  imc;
  gen;
  constructor(private loadingCtrl: LoadingController,public popoverController: PopoverController,private NavParams: NavParams ) { 


  }

  getUsuario(){
    return new Promise((resolve) => {
      this.usuarios=[];
      this.keys=[];
      var p = firebase.database().ref().child("/usuario");
      p.on("value",(snap)=>{
        let data = snap.val();
        for(var key in data){
          this.keys.push(key);
          this.usuarios.push(data[key]);  
        }
        resolve(true);
      });

    });
  }

 async ngOnInit() {
    this.email=this.NavParams.get('customemail');
    this.usuario=[];
    return new Promise(async (resolve) => {
     let loader = await this.loadingCtrl.create({});
     loader.present();
     this.getUsuario().then((x) => {
       if(x){
         for(var i=0;i<this.usuarios.length;i++){
           if(this.usuarios[i].email===this.email){
             this.usuario.push(this.usuarios[i]);
             this.llaveUsuario=this.keys[i];
           }
         }
         console.log('USUARIO '+this.usuario[0].email);
         this.imc=this.usuario[0].imc;
         this.gen=this.usuario[0].genero;
         this.nombre=this.usuario[0].nombres;
        if(this.imc<=18.5){
          this.texto="Se encuentra bajo de peso. Debería tomar dietas para subir de peso y ganar masa muscular"
        }else if(this.imc<24.9){
          this.texto="Se encuentra con un peso normal. Debería tomar dietas para mantener forma."
        }else if(this.imc<29.9){
          this.texto="Se encuentra con un peso normal-medio. Debería tomar dietas mantener forma y ganar masa muscular"
        }else if(this.imc<34.9){
          this.texto="Se encuentra con obesidad. Debería tomar dietas bajar de peso."
        }else{
          this.texto="Se encuentra con obesidad-alta. Debería tomar dietas bajar de peso."
        }



         loader.dismiss();
         resolve(true);
       }
     });
   });
  }
  
  closePopo(){
    this.popoverController.dismiss();
  }
}
