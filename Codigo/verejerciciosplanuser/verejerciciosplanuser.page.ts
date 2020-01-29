import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { NavController, ActionSheetController, AlertController, LoadingController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireList, snapshotChanges, AngularFireAction } from 'angularfire2/database';
import { database } from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { PlanEjercicio } from '../modelos/planejercicio';
import { map, switchMap } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Evento } from '../modelos/evento';


@Component({
  selector: 'app-verejerciciosplanuser',
  templateUrl: './verejerciciosplanuser.page.html',
  styleUrls: ['./verejerciciosplanuser.page.scss'],
})
export class VerejerciciosplanuserPage implements OnInit {
  ev = {} as Evento;

  nombre;
  key;
  rol;
  email;

  usuarios=[];
  keys=[];
  usuario = [];
  llaveUsuario;
  llaveEjercicio;
  plan=[];
  todosplanes=[];
  itemsRef: AngularFireList<any>;

  listaEjerciciosRef$: Observable<any[]>
  constructor(private loadingCtrl: LoadingController,public alertController: AlertController,public router: Router,private route: ActivatedRoute,public storage: Storage,public navCtrl: NavController, private database: AngularFireDatabase) {   
    let sub = this.route.params.subscribe(params => {
      this.key= params['planID'];
      this.rol=params['rol'];
      this.email=params['email'];
    });
    console.log(this.key);
    console.log(this.rol);
    this.listaEjerciciosRef$ = this.database.list('planejercicio/'+this.key+'/ejercicios').valueChanges();
    this.itemsRef = database.list('planejercicio');

  }
  ngOnInit() {
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
        loader.dismiss();
        resolve(true);
      }
    });
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

  atras(){
    this.router.navigate(['/ejercicio',{ userEmail:this.email}]);
  }


  agregarPlan(){
    this.plan=[];
    return new Promise((resolve) => {
    var p = firebase.database().ref().child("planejercicio");
    p.on("value",(snap)=>{
      let data = snap.val();
      for(var key in data){
        if(key==this.key){
          this.plan.push(data[key]);   
          resolve(true);
        }
          this.todosplanes.push(data[key]);
      }
    });
  });
}

  async seleccionarPlan(){ 
    this.plan=[];   
    let loader = await this.loadingCtrl.create({});
    loader.present();
    this.agregarPlan().then(async (y) => {
      loader.dismiss();
      if(y){
        let loaderr = await this.loadingCtrl.create({});
        loaderr.present();
        this.ngOnInit().then(async (x) => {
        loaderr.dismiss();
        if(x){
          console.log(this.usuario[0]);
          if(this.usuario[0].planes!==undefined){
            const alert = await this.alertController.create({
            header: 'Atención',
            message: 'Ya tiene un plan agregado.',
            buttons: ['OK']
            });
            await alert.present();
        }else{
          console.log(this.usuario[0].planes);
          console.log(this.plan);
          for(var i=0; i<this.plan[0].duracion;i++){
            this.ev.desc=this.plan[0].nombre;
            this.ev.title='Plan ejercicio';
            let fech = new Date();
            let fech2 = new Date(fech.getFullYear(), fech.getMonth(), fech.getDate()+i+1, 7, 30, 0);
            let fech3= new Date(fech.getFullYear(), fech.getMonth(), fech.getDate()+i+1, 9, 30, 0);
            this.ev.startTime= fech2.toISOString();
            this.ev.endTime= fech3.toISOString();
            this.ev.allDay=false;
            this.ev.tipo="ejercicio";
            this.database.list('usuario/'+this.llaveUsuario+'/calendario').push(this.ev).key;  
          }

          if(this.usuario[0].genero=="Masculino"){
            this.plan[0].vecesSeleccionadoHombre+=1; 
          }else{
            this.plan[0].vecesSeleccionadoMujer+=1;
          }

          if(this.usuario[0].edad<20){
            this.plan[0].vecesSeleccionadoBaja+=1;
          }else if(this.usuario[0].edad>=20&&this.usuario[0].edad<30){
            this.plan[0].vecesSeleccionadoMedia+=1;
          }else if(this.usuario[0].edad>=30&&this.usuario[0].edad<40){
            this.plan[0].vecesSeleccionadoAlta+=1;
          }else{
            this.plan[0].vecesSeleccionadoMuyAlta+=1;
          }
          this.plan[0].vecesSeleccionado+=1;
          this.itemsRef.update(this.key,this.plan[0]);
          //firebase.database().ref().child('planejercicio/'+this.plan[0].key).update({descripcion:this.plan[0].descripcion,ejercicios:this.plan[0].ejercicios,imagen:this.plan[0].imagen,nombre:this.plan[0].nombre,objetivo:this.plan[0].objetivo,visible:this.plan[0].visible,vecesSeleccionado:this.plan[0].vecesSeleccionado+1});
          this.plan[0].vecesSeleccionado += 1 ; 
          let llf=this.database.list('usuario/'+this.llaveUsuario+'/planes').push(this.plan[0]).key;
          this.plan[0].key=llf;
          this.database.list('usuario/'+this.llaveUsuario+'/planes').update(llf,this.plan[0]);
          const alert = await this.alertController.create({
            header: 'Atención',
            message: 'Se ha agregado el plan.',
            buttons: ['OK']
            });
            await alert.present();
        }
      }
    });
  }
    });
  }
}
