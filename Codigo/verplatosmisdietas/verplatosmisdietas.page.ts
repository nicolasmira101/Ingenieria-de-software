import { AngularFireDatabase, AngularFireList, snapshotChanges, AngularFireAction } from 'angularfire2/database';
import * as firebase from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Dieta } from '../modelos/dieta';
import { map, switchMap } from 'rxjs/operators';
import { Evento } from '../modelos/evento';
import { Caloria } from '../modelos/caloria';
import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { AlertController, LoadingController, NavController } from '@ionic/angular';

@Component({
  selector: 'app-verplatosmisdietas',
  templateUrl: './verplatosmisdietas.page.html',
  styleUrls: ['./verplatosmisdietas.page.scss'],
})
export class VerplatosmisdietasPage implements OnInit {
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
  usuariokey;
  itemsRef: AngularFireList<any>;

  constructor(public alertController: AlertController,private loadingCtrl: LoadingController,public router: Router,private route: ActivatedRoute,public storage: Storage,public navCtrl: NavController, private database: AngularFireDatabase) {   

    let sub = this.route.params.subscribe(params => {
      this.key= params['dietaID'];
      this.rol=params['rol'];
      this.email=params['email'];
      this.usuariokey=params['usuariokey'];
    });
    console.log(this.key);
    console.log(this.email);
    this.listaPlatosRef$ = this.database.list('usuario/'+this.usuariokey+'/dietas/'+this.key+'/platos').valueChanges();


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
      var p = firebase.database().ref().child('usuario/'+this.usuariokey+'/dietas/'+this.key+'/platos');
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
      });
  }
  atras(){
    this.router.navigate(['/misdietas',{ userEmail:this.email}]);
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
}
