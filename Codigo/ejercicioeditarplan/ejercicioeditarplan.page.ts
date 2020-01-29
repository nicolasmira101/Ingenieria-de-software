import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Observable } from 'rxjs';
import { NavController, ActionSheetController, NavParams, AlertController, LoadingController } from '@ionic/angular';
import { PlanEjercicio } from '../modelos/planejercicio';
import { Storage } from '@ionic/storage';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Ejercicio } from '../modelos/ejercicio';
import { PlatformLocation } from '@angular/common';
import * as firebase from 'firebase';

@Component({
  selector: 'app-ejercicioeditarplan',
  templateUrl: './ejercicioeditarplan.page.html',
  styleUrls: ['./ejercicioeditarplan.page.scss'],
})
export class EjercicioeditarplanPage implements OnInit {
  plan = {} as PlanEjercicio;
  plani=[];
  key;
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  items2: Observable<any[]>;

  arreglo: Observable<any[]>;

  ejerciciosSeleccionados: Ejercicio[] = [];
  itemsRefEjercicio: AngularFireList<any>;
  itemsEjercicio: Observable<any[]>;
 tam=0;
  filteredItems: Array<Ejercicio> = [];
  platico:Ejercicio;
  aux = [];

  todosPlanes=[];
  keys=[];


  auxiliar = []; 
 constructor(private loadingCtrl: LoadingController,public alertController: AlertController,private actionSheet: ActionSheetController,private route: ActivatedRoute,public storage: Storage,public navCtrl: NavController, private database: AngularFireDatabase) { 
   this.itemsRef = database.list('planejercicio');
   this.ejerciciosSeleccionados=[];
   // Use snapshotChanges().map() to store the key
   this.items = this.itemsRef.snapshotChanges().pipe(
     map(changes => 
       changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
     )
   );
   let sub = this.route.params.subscribe(params => {
    this.key = params['planID'];
   });


   this.arreglo = this.database.list('/planejercicio/'+this.key,  ref => ref.orderByChild('nombre')).valueChanges();
   this.arreglo.subscribe( valueOfItems => {
       console.log(valueOfItems);
   })

   this.arreglo.subscribe((pla) => {
     this.auxiliar= pla;
     this.cambiarValor();
   });



   this.items2 = this.database.list('/planejercicio/'+this.key+'/ejercicios',  ref => ref.orderByChild('ejercicios')).valueChanges();
   this.items2.subscribe( valueOfItems => {
       this.tam++;
       console.log(valueOfItems);
   })

   this.itemsRefEjercicio = database.list('ejercicio');
   // Use snapshotChanges().map() to store the key
   this.itemsEjercicio = this.itemsRefEjercicio.snapshotChanges().pipe(
     map(changes => 
       changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
     )
   );
 }

 ngOnInit() {
  this.plani=[];
  return new Promise(async (resolve) => {
   let loader = await this.loadingCtrl.create({});
   loader.present();
   this.getPlan().then((x) => {
     if(x){
       for(var i=0;i<this.todosPlanes.length;i++){
         if(this.todosPlanes[i].key===this.key){
           this.plani.push(this.todosPlanes[i]);
  
         }
       }
       loader.dismiss();
       resolve(true);
     }
   });
 });
 }


 getPlan(){
  return new Promise((resolve) => {
    this.todosPlanes=[];
    this.keys=[];
    var p = firebase.database().ref().child("/planejercicio");
    p.on("value",(snap)=>{
      let data = snap.val();
      for(var key in data){
        this.keys.push(key);
        this.todosPlanes.push(data[key]);  
      }
      resolve(true);
    });

  });
}

 async cambiarValor(){
  let loaderr = await this.loadingCtrl.create({});
  loaderr.present();
  this.ngOnInit().then(async (x) => {
  loaderr.dismiss();
  if(x){
     document.getElementById('inputnombre').setAttribute('value',this.plani[0].nombre);
     document.getElementById('inputdescripcion').setAttribute('value',this.plani[0].descripcion);
     document.getElementById('inputimagen').setAttribute('value',this.plani[0].imagen);
     document.getElementById('inputduracion').setAttribute('value',this.plani[0].duracion);
    }
     
  }); 
   
 }
 async elementoSeleccionado(ejercicio:Ejercicio,key:string){
  
   var texto="Agregar ejercicio al plan";

   for(var i = 0;i<this.ejerciciosSeleccionados.length;i++) { 
     console.log(this.ejerciciosSeleccionados[i].nombre+'==='+ejercicio.nombre);
     if(this.ejerciciosSeleccionados[i].nombre===ejercicio.nombre){
       texto="Quitar ejercicio del plan";
       break;
     }
   }
   console.log('hola'+texto);
     const action = await this.actionSheet.create({
       header:`${ejercicio.nombre}`,
       buttons: [
         {
           text: texto,
           handler: () =>{
             if(texto==="Agregar ejercicio al plan"){
               this.ejerciciosSeleccionados.push(ejercicio);
             }else{
               for(var i = 0;i<this.ejerciciosSeleccionados.length;i++) { 
                 if(this.ejerciciosSeleccionados[i].nombre===ejercicio.nombre){
                     this.ejerciciosSeleccionados.splice(i,1);
                 }
               }
             }
           } 
          },
         {
           text: 'Cancelar',
           role: 'cancel',
           handler: () =>{
             console.log("El usuario ha cancelado la petición");
           }
         }
       ]
     });
     await action.present();
 }

  actualizarPlan(plan:PlanEjercicio){

   this.items2.subscribe((pla) => {
     this.aux= pla;
     this.invocar(this.aux,plan);
   });

   for(var i =0;i<this.ejerciciosSeleccionados.length;i++){
     var llf = this.database.list('planejercicio/'+this.key+'/ejercicios').push(this.ejerciciosSeleccionados[i]).key;
       this.ejerciciosSeleccionados[i].key=llf;
       this.database.list('planejercicio/'+this.key+'/ejercicios/').update(llf,this.ejerciciosSeleccionados[i]);
     console.log(this.ejerciciosSeleccionados[i].nombre);
 }
 
   //this.database.list('dieta/'+this.key+'/platos').push(this.platosSeleccionados);

   this.itemsRef.update(this.key,plan);

   document.getElementById('inputnombre').setAttribute('value',"");
   document.getElementById('inputdescripcion').setAttribute('value',"");
   document.getElementById('inputimagen').setAttribute('value',"");
   document.getElementById('inputduracion').setAttribute('value',"");
    
 }

 invocar(ejercicios:any,plan:PlanEjercicio){
   var k=this.ejerciciosSeleccionados.length;
   for(var i=0; i< this.aux.length;i++){
     for(var j=0; j<this.ejerciciosSeleccionados.length;j++){
       console.log('tamano '+this.aux.length+'--le--'+k);
       console.log(i+'--'+j);
       console.log(this.aux[i].nombre+'--'+this.ejerciciosSeleccionados[j].nombre);
       if(this.aux[i].nombre===this.ejerciciosSeleccionados[j].nombre){
      
         console.log('El plato '+this.ejerciciosSeleccionados[j].nombre+' ya está en la dieta');
         this.ejerciciosSeleccionados.splice(j,1);
       }else{
           console.log('Se agregó el plato '+this.ejerciciosSeleccionados[j].nombre);
       }
     }
   }
 

 }

 volver(){
   this.navCtrl.navigateForward('ejercicioadmin');
 }
}
