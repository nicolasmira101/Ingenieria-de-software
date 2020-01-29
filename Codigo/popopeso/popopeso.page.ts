import { Component, OnInit } from '@angular/core';
import { ParseSourceFile } from '@angular/compiler';
import { Peso } from '../modelos/peso';
import { PopoverController, NavParams, LoadingController, AlertController } from '@ionic/angular';
import * as firebase from 'firebase';
import { FormGroup, FormBuilder, FormControl, Validators, AbstractControl } from '@angular/forms';
import { AngularFireList, AngularFireDatabase } from 'angularfire2/database';
@Component({
  selector: 'app-popopeso',
  templateUrl: './popopeso.page.html',
  styleUrls: ['./popopeso.page.scss'],
})
export class PopopesoPage implements OnInit {
  p = {} as Peso;
  email;
  nombre;
  usuarios = [];
  usuario = [];
  keys= [];
  itemsRef: AngularFireList<any>;

  llaveUsuario;
  imc;
  gen;
  registerForm: FormGroup;
  error_messages = {
    'peso':[
      { type: 'required', message: 'El peso es requerido.'},
      { type: 'pattern', message: 'Por favor ingrese un peso válido en kilogramos. Ejemplo (65) (81)'}
    ]
  }
  alertController: any;
  constructor(public alertContrller: AlertController,private database: AngularFireDatabase,public formBuilder: FormBuilder,private loadingCtrl: LoadingController,public popoverController: PopoverController,private NavParams: NavParams ) { 
    this.itemsRef = database.list('usuario');
    this.registerForm = this.formBuilder.group({
      peso: new FormControl('',Validators.compose([
        Validators.required,
        Validators.maxLength(3),
        Validators.pattern('(1[0-9][0-9])|([2-9][0-9])')
      ])),
    });
  }
  mustBeTruthy(c: AbstractControl): { [key: string]: boolean } {
    let rv: { [key: string]: boolean } = {};
    if (!c.value) {
      rv['notChecked'] = true;
    }
    return rv;
  }
  async actualizarPeso(){
  
    var dateObj = new Date();
    var month = dateObj.getUTCMonth() + 1; //months from 1-12
    var day = dateObj.getUTCDate();
    var year = dateObj.getUTCFullYear();
    this.p.fecha = year + "/" + month + "/" + day;
    this.usuario[0].peso=this.p.pes;
    let y= parseFloat(String(this.usuario[0].peso/((this.usuario[0].altura/100)*(this.usuario[0].altura/100)))).toFixed(2) ;
    this.usuario[0].imc = +y;
    this.itemsRef.update(this.llaveUsuario,this.usuario[0]);
    this.p.pes=this.usuario[0].imc;
    firebase.database().ref().child("/usuario/"+this.llaveUsuario+"/pesos").push(this.p);
    const alert = await this.alertContrller.create({
      header: 'Alerta',
      message: 'Se ha actualizado el peso correctamente.',
      buttons: ['OK']
    });
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
  ngOnInit() {
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
