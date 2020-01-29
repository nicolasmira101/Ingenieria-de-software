import { Component, OnInit } from '@angular/core';
import { NavController, ActionSheetController, MenuController, LoadingController } from '@ionic/angular';
import { Dieta } from '../modelos/dieta';  
import { AngularFireDatabase, AngularFireList, AngularFireAction } from 'angularfire2/database';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import { Storage } from '@ionic/storage';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { defaultIterableDiffers } from '@angular/core/src/change_detection/change_detection';
import { AgregardietaPage } from '../agregardieta/agregardieta.page';
import { Ejercicio } from '../modelos/ejercicio';
import * as firebase from 'firebase';

@Component({
  selector: 'app-ejercicio',
  templateUrl: './ejercicio.page.html',
  styleUrls: ['./ejercicio.page.scss'],
})
export class EjercicioPage implements OnInit {
  emaile;
  usuario = {} as User;
  genero;
  objetivo;
  estadoFisico;
  showSkip = true;

  llaveUsuario;

  ejercicio = {} as Ejercicio;//diet

  itemsRefUsuario: AngularFireList<any>;
  itemsUsuario: Observable<any[]>;
  recomendaciones=[];
  usuario$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  email$: BehaviorSubject<string|null>;
  listaEjerciciosRef$: Observable<any[]>
 
  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  llaves=[];

  ejercicioss: Ejercicio [] =[];

  ejerciciosSeleccionadas: Ejercicio[] = [];

  planestodos=[];

  usua=[];
  us=[];
  keys=[];
  constructor(private loadingCtrl: LoadingController,public storage: Storage,private actionSheet: ActionSheetController,public router: Router,private database: AngularFireDatabase,private route: ActivatedRoute,private menu: MenuController,public navCtrl: NavController) { 
   
    let sub = this.route.params.subscribe(params => {
      this.emaile = params['userEmail'];
     });
     this.usuario.email=this.emaile;

    this.listaEjerciciosRef$= this.database.list('planejercicio').valueChanges();
   var arrayOfKeys = []

   this.items = this.database.list('/planejercicio',  ref => ref.orderByChild('visible').equalTo(true)).valueChanges();
    this.items.subscribe( valueOfItems => {
        console.log(valueOfItems);
    })

/*
   this.database.database.ref('dieta')
   .orderByChild('visible')
   .equalTo(true)
   .once('value')
   .then(snapshot=>{
       snapshot.forEach(function(child_element){
       arrayOfKeys.push(child_element.key)
       console.log(child_element.key)
       
   })
   }
   );
   */
   

    
    this.email$ = new BehaviorSubject(null);
    this.usuario$ = this.email$.pipe(
      switchMap(email => 
        database.list('/usuario', ref =>
         email ? ref.orderByChild('email').equalTo(email) : ref
        ).snapshotChanges()
      )
    );
    
    this.email$.next(this.usuario.email);

     this.itemsRefUsuario = database.list('usuario');
     this.itemsUsuario = this.itemsRefUsuario.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

  }

  onSlideChangeStart(event) {
    event.target.isEnd().then(isEnd => {
      this.showSkip = !isEnd;
    });
  }

  guardarPlan(genero2:string, objetivo2:string, estadoFisico2:string){
    this.genero = genero2;
    this.objetivo = objetivo2;
    this.estadoFisico = estadoFisico2;
  }



  getUsuario(){
    return new Promise((resolve) => {
      this.us=[];
      this.keys=[];
      var p = firebase.database().ref().child("/usuario");
      p.on("value",(snap)=>{
        let data = snap.val();
        for(var key in data){
          this.keys.push(key);
          this.us.push(data[key]);  
        }
        resolve(true);
      });

    });
  }


  ngOnInit() {
    
    this.usua=[];
    return new Promise(async (resolve) => {
     let loader = await this.loadingCtrl.create({});
     loader.present();
     this.getUsuario().then(async (x) => {
       if(x){
         for(var i=0;i<this.us.length;i++){
           if(this.us[i].email===this.emaile){
             this.usua.push(this.us[i]);
             this.llaveUsuario=this.keys[i];
           }
         }
         loader.dismiss();
         resolve(true);
         let loaderr = await this.loadingCtrl.create({});
          loaderr.present();
          this.getPlanes().then(async (y) => {
          loaderr.dismiss();
          console.log(this.planestodos);
          console.log(this.usua[0]);
          if(y){
           this.planestodos.forEach(element => {
              if(this.usua[0].genero === element.genero || element.genero === "No definido"){
                console.log('Bien genero');

                if(this.usua[0].meta === element.objetivo){
                  console.log('Bien objetivo');

                  if(this.usua[0].estadofisico === element.estadofisico){
                    console.log('Recomendó');
                      this.recomendaciones.push(element);
                  }
                }
              } 
            });
            console.log(this.recomendaciones);
          }
        });
      }
    });
  });
}

   async elementoSeleccionado(ejercicio:Ejercicio,key:string){
       this.router.navigate(['/verejerciciosplanuser',{ planID: key, rol: 0, email: this.emaile}]);
  }
  getPlanes(){
    return new Promise((resolve) => {
      var that=this;
    this.planestodos=[];
      var p = firebase.database().ref().child("/planejercicio");
      p.on("value",(snap)=>{
        let data = snap.val();
        for(var key in data){
          this.planestodos.push(data[key]);  
          resolve(true);
        }
      });
      

    });
  }
  atras(){
    this.router.navigate(['/userhome',{ userEmail: this.usuario.email}]);  
  }
}