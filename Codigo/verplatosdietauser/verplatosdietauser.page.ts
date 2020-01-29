import { Component, OnInit } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { NavController, ActionSheetController, LoadingController, AlertController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireList, snapshotChanges, AngularFireAction } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Dieta } from '../modelos/dieta';
import { map, switchMap } from 'rxjs/operators';
import { Evento } from '../modelos/evento';
import { Caloria } from '../modelos/caloria';
@Component({
  selector: 'app-verplatosdietauser',
  templateUrl: './verplatosdietauser.page.html',
  styleUrls: ['./verplatosdietauser.page.scss'],
})
export class VerplatosdietauserPage implements OnInit {
  dieta =[];
  todasDietas = [];
  planes= [];

  dietaEjemplo = {} as Dieta;
  c= {} as Caloria;
  nombre;
  key;
  rol;
  email;
  aux=[];

  a;

  usuarios=[];
  keys=[];
  usuario = [];
  llaveUsuario;
  llaveDieta

  listaPlatosRef$: Observable<any[]>
  prueba
  ev = {} as Evento;

  todosplatos=[];
  desayuno=[];
  almuerzo=[];
  comida=[];
  merienda=[];

  almuer=[];
  items=[];
  itemsRef: AngularFireList<any>;

  constructor(public alertController: AlertController,private loadingCtrl: LoadingController,public router: Router,private route: ActivatedRoute,public storage: Storage,public navCtrl: NavController, private database: AngularFireDatabase) {   
    this.itemsRef = database.list('dieta');

    let sub = this.route.params.subscribe(params => {
      this.key= params['dietaID'];
      this.rol=params['rol'];
      this.email=params['email'];
    });
    console.log(this.key);
    console.log(this.rol);
    this.listaPlatosRef$ = this.database.list('dieta/'+this.key+'/platos').valueChanges();


    this.items = [
      { expanded: false,
        nombre:'Desayuno'
      },
      { expanded: false,
        nombre:'Almuerzo' },
      { expanded: false,
        nombre:'Comida' },
      { expanded: false,
        nombre:'Merienda' },
    ];
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

  getPlatos(){
    return new Promise((resolve) => {
        this.todosplatos=[];
        this.desayuno=[];
        this.almuerzo=[];
        this.comida=[];
        this.merienda=[];
      var p = firebase.database().ref().child('dieta/'+this.key+'/platos');
      p.on("value",(snap)=>{
        let data = snap.val();
        for(var key in data){
          this.todosplatos.push(data[key]);  
        }
        resolve(true);
      });

    });
  }


 async ngOnInit() {

   this.usuario=[];
   return new Promise(async (resolve) => {
    let loader = await this.loadingCtrl.create({});
    loader.present();
    this.getUsuario().then(async (x) => {
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
        let loaderr = await this.loadingCtrl.create({});
        loaderr.present();
        this.getPlatos().then(async (y) => {
        loaderr.dismiss();
        if(y){
          for(var i=0;i<this.todosplatos.length;i++){
            if(this.todosplatos[i].tipo==="Desayuno"){
              this.desayuno.push(this.todosplatos[i]);
            }else if(this.todosplatos[i].tipo==="Almuerzo"){
              this.almuerzo.push(this.todosplatos[i]);
            }else if(this.todosplatos[i].tipo==="Comida"){
              this.comida.push(this.todosplatos[i]);
            }else{
              this.merienda.push(this.todosplatos[i]);
            }
          }


        


          console.log(this.desayuno);
          console.log(this.almuerzo);
          console.log(this.comida);
          console.log(this.merienda);

        }
        });
      }
    });
  });
  }
  atras(){
    this.router.navigate(['/nutricion',{ userEmail:this.email}]);
  }
  agregarDieta(){
    this.dieta=[];
    return new Promise((resolve) => {
    var p = firebase.database().ref().child("dieta");
    p.on("value",(snap)=>{
      let data = snap.val();
      for(var key in data){
        if(key==this.key){
          this.dieta.push(data[key]);   
          resolve(true);
        }
          this.todasDietas.push(data[key]);
        console.log(this.dieta);
      }
      console.log(this.dieta);
    });
  });
}
  async seleccionarDieta(){    
      let loader = await this.loadingCtrl.create({});
      loader.present();
      this.agregarDieta().then(async (y) => {
        loader.dismiss();
        if(y){
          let loaderr = await this.loadingCtrl.create({});
          loaderr.present();
          this.ngOnInit().then(async (x) => {
          loaderr.dismiss();
          if(x){
            console.log(this.usuario[0]);
            if(this.usuario[0].dietas!==undefined){
              const alert = await this.alertController.create({
              header: 'Atención',
              message: 'Ya tiene una dieta agregada.',
              buttons: ['OK']
              });
              await alert.present();
          }else{
            const alert = await this.alertController.create({
              header: 'Atención',
              message: 'Se ha agregado la dieta a sus dietas personalizadas.',
              buttons: ['OK']
              });
              await alert.present();
            console.log(this.usuario[0].dietas);
            console.log(this.dieta);
            for(var i=0; i<this.dieta[0].duracion;i++){
              this.ev.desc=this.dieta[0].nombre;
              this.ev.title='Dieta';
              let fech = new Date();
              let fech2 = new Date(fech.getFullYear(), fech.getMonth(), fech.getDate()+i+1, 10, 30, 0);
              let fech3= new Date(fech.getFullYear(), fech.getMonth(), fech.getDate()+i+1, 11, 30, 0);
              this.ev.startTime= fech2.toISOString();
              this.ev.endTime= fech3.toISOString();
              this.ev.allDay=false;
              this.ev.tipo="dieta";
              this.database.list('usuario/'+this.llaveUsuario+'/calendario').push(this.ev).key;  
            }
            this.dieta[0].vecesSeleccionada+=1;
            this.dieta[0].vecesSeleccionadaMujer=0;
            this.dieta[0].vecesSeleccionadaHombre=0;
            this.dieta[0].vecesSeleccionadaBaja=0;
            this.dieta[0].vecesSeleccionadaMedia=0;
            this.dieta[0].vecesSeleccionadaAlta=0;
            this.dieta[0].vecesSeleccionadaMuyAlta=0;
            if(this.usuario[0].genero=="Masculino"){
              this.dieta[0].vecesSeleccionadaHombre+=1; 
            }else{
              this.dieta[0].vecesSeleccionadaMujer+=1;
            }

            if(this.usuario[0].edad<20){
              this.dieta[0].vecesSeleccionadaBaja+=1;
            }else if(this.usuario[0].edad>=20&&this.usuario[0].edad<30){
              this.dieta[0].vecesSeleccionadaMedia+=1;
            }else if(this.usuario[0].edad>=30&&this.usuario[0].edad<40){
              this.dieta[0].vecesSeleccionadaAlta+=1;
            }else{
              this.dieta[0].vecesSeleccionadaMuyAlta+=1;
            }

            this.itemsRef.update(this.key,this.dieta[0]);
            //firebase.database().ref().child('dieta/'+this.dieta[0].key).update({descripcion:this.dieta[0].descripcion,duracion:this.dieta[0].duracion,nombre:this.dieta[0].nombre,imagen:this.dieta[0].imagen,objetivo:this.dieta[0].objetivo,platos:this.dieta[0].platos,visible:this.dieta[0].visible,vecesSeleccionada:this.dieta[0].vecesSeleccionada+1});
            this.dieta[0].vecesSeleccionada += 1 ; 
            let llf=this.database.list('usuario/'+this.llaveUsuario+'/dietas').push(this.dieta[0]).key;
            this.dieta[0].key=llf;
            this.database.list('usuario/'+this.llaveUsuario+'/dietas').update(llf,this.dieta[0]);

            var dateObj = new Date();
            var month = dateObj.getUTCMonth() + 1; //months from 1-12
            var day = dateObj.getUTCDate();
            var year = dateObj.getUTCFullYear();
            this.c.fecha = year + "/" + month + "/" + day;
            this.c.pes=this.dieta[0].calorias;
            firebase.database().ref().child("/usuario/"+this.llaveUsuario+"/calorias").push(this.c);
          }
        }
      });
    }
      });
    }
   
    

}
