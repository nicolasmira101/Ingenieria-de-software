import { Component, OnInit } from '@angular/core';
import { NavController, Events,ActionSheetController, MenuController, LoadingController } from '@ionic/angular';
import { Dieta } from '../modelos/dieta';  
import { AngularFireDatabase, AngularFireList, AngularFireAction } from 'angularfire2/database';
import { Observable, BehaviorSubject } from 'rxjs';
import { User } from 'firebase';
import { Router, ActivatedRoute } from '@angular/router';
import { switchMap, map } from 'rxjs/operators';
import * as firebase from 'firebase';
import { Storage } from '@ionic/storage';
import { listLazyRoutes } from '@angular/compiler/src/aot/lazy_routes';
import { defaultIterableDiffers } from '@angular/core/src/change_detection/change_detection';
import { AgregardietaPage } from '../agregardieta/agregardieta.page';

@Component({
  selector: 'app-nutricion',
  templateUrl: './nutricion.page.html',
  styleUrls: ['./nutricion.page.scss'],
})
export class NutricionPage implements OnInit {
  rate=0;
  emaile;
  diet = {} as Dieta;
  itemsRefUsuario: AngularFireList<any>;
  itemsUsuario: Observable<any[]>;

  usuario$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  email$: BehaviorSubject<string|null>;
  listaDietasRef$: Observable<any[]>
 
responses;

  itemsRef: AngularFireList<any>;
  items: Observable<any[]>;
  llaves=[];
  dietass: Dieta [] =[];
  dietas=[];
  dietasSeleccionadas: Dieta[] = [];
  showSkip = true;
  aux=[];
recomendaciones=[];
  usuarios=[];
  keys=[];
  usuario = [];
  llaveUsuario;

  constructor(private loadingCtrl: LoadingController,public events: Events,public storage: Storage,private actionSheet: ActionSheetController,public router: Router,private database: AngularFireDatabase,private route: ActivatedRoute,private menu: MenuController,public navCtrl: NavController) { 
    let sub = this.route.params.subscribe(params => {
      this.emaile = params['userEmail'];
     });

    this.listaDietasRef$= this.database.list('dieta').valueChanges();
   var arrayOfKeys = []

   this.items = this.database.list('/dieta',  ref => ref.orderByChild('visible').equalTo(true)).valueChanges();
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
    
    this.email$.next(this.emaile);

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
  getDietas(){
    return new Promise((resolve) => {
      var that=this;
    this.dietas=[];
      var p = firebase.database().ref().child("/dieta");
      p.on("value",(snap)=>{
        let data = snap.val();
        for(var key in data){
          console.log(key);
          this.dietas.push(data[key]);  
          console.log(this.dietas)
          resolve(true);
        }
      });
      

    });
  }
  ngOnInit() {

    this.usuario=[];
    return new Promise(async (resolve) => {
     let loader = await this.loadingCtrl.create({});
     loader.present();
     this.getUsuario().then(async (x) => {
       if(x){
         for(var i=0;i<this.usuarios.length;i++){
           if(this.usuarios[i].email===this.emaile){
             this.usuario.push(this.usuarios[i]);
             this.llaveUsuario=this.keys[i];
           }
         }
         console.log('USUARIO '+this.usuario[0].email);
         loader.dismiss();
         resolve(true);
         let loaderr = await this.loadingCtrl.create({});
        loaderr.present();
        this.getDietas().then(async (y) => {
        loaderr.dismiss();
        if(y){
    this.dietas.forEach(element => {
      console.log(element.objetivo + this.usuario[0].meta);
      if(element.objetivo === 'Mantener forma' && this.usuario[0].meta === 'Mantener forma'){
        console.log("entró")
        if(this.usuario[0].imc >= 18.5 && this.usuario[0].imc <= 29.9){
          console.log("entró2")
          this.recomendaciones.push(element);
        }
        else if(this.usuario[0].imc <= 18.4){
            this.responses = 'Usted se encuentra en un peso inferior al normal, se le recomienda una dieta para aumentar su peso';
        }
        else {
          this.responses = 'Usted se encuentra en un peso mayor al normal, se le recomienda una dieta para bajar su peso';
        }
      }
      else if(element.objetivo === 'Perder peso' && this.usuario[0].meta === 'Perder peso'){
        if(this.usuario[0].imc > 25 && this.usuario[0].imc <=40){
          this.recomendaciones.push(element);
        }
        else if(this.usuario[0].imc <= 18.4){
          this.responses = 'Usted se encuentra en un peso inferior al normal, se le recomienda una dieta para aumentar su peso';
      }
      else {
        this.responses = 'Usted se encuentra en un peso mucho mayor al normal, se le recomienda una dieta mas especializada para bajar su peso';
      }
      }
      else if(element.objetivo === 'Ganar masa muscular' && this.usuario[0].meta === 'Ganar masa muscular'){
        if(this.usuario[0].imc >= 18.5 && this.usuario[0].imc <=35){
          this.recomendaciones.push(element);
        }
        else if(this.usuario[0].imc <= 18.4){
          this.responses = 'Usted se encuentra en un peso inferior al normal, se le recomienda una dieta para aumentar su peso';
      }
      else {
        this.responses = 'Usted se encuentra en un peso mucho mayor al normal, se le recomienda asistir an profesional en salud';
      }
      }
  
      
    });
    console.log(this.recomendaciones);
    console.log(this.responses);
  }
});
}
});
});
}

   async elementoSeleccionado(dieta:Dieta,key:string){
     this.diet=dieta
    this.router.navigate(['/verplatosdietauser',{ dietaID: key, rol: 0, email: this.emaile}]);
  
  
  }
   
  atras(){
    this.router.navigate(['/userhome',{ userEmail: this.emaile}]);  
  }

  

}
