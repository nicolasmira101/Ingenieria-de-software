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
import { PlanEjercicio } from '../modelos/planejercicio';
import * as firebase from 'firebase';


@Component({
  selector: 'app-misplanes',
  templateUrl: './misplanes.page.html',
  styleUrls: ['./misplanes.page.scss'],
})
export class MisplanesPage implements OnInit {
  emaile;
  email;
  ejercicioeliminar=[];
  usuarios=[];
  keys=[];
  usuario;
  llave;
  listaPlanesRef$: Observable<any[]>


  constructor(private loadingCtrl: LoadingController,public storage: Storage,private actionSheet: ActionSheetController,public router: Router,private database: AngularFireDatabase,private route: ActivatedRoute,private menu: MenuController,public navCtrl: NavController) {

    let sub = this.route.params.subscribe(params => {
      this.email=params['userEmail'];
    });
   }

 
   async ngOnInit() {
    let loader = await this.loadingCtrl.create({});
    loader.present();
    this.getUsuario().then((x) => {
      if(x){
        console.log('todo ok');
        for(var i=0;i<this.usuarios.length;i++){
          console.log(this.usuarios[i].email + '===' +this.email)
          if(this.usuarios[i].email===this.email){
            this.usuario=this.usuarios[i];
            this.llave=this.keys[i];
          }
        }

        var p = firebase.database().ref().child("/usuario/"+this.llave+"/calendario");
        p.on("value",(snap)=>{
          let data = snap.val();
          for(var key in data){
              if(data[key].tipo==="ejercicio"){
                this.ejercicioeliminar.push(key);
              }
        }
        });
       
        console.log('USUARIO '+this.usuario.email);
        console.log(this.llave);
        this.listaPlanesRef$ = this.database.list('usuario/'+this.llave+'/planes').valueChanges();
console.log(this.listaPlanesRef$);
        loader.dismiss();
      }
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
          console.log(key);
          this.keys.push(key);
          this.usuarios.push(data[key]);  
          console.log(this.usuarios);
        }
        resolve(true);
      });

    });
  }

 async elementoSeleccionado(plan:PlanEjercicio,key:string){
  const action = await this.actionSheet.create({
    header:`${plan.nombre}`,
    buttons: [
      {
        text: 'Ver platos de la dieta',
        handler: () => {
          this.router.navigate(['/verejerciciosmisplanes',{ planID: key, rol: 0, email: this.emaile, usuariokey:this.llave}]);
        }
      },
      {
        text: 'Eliminar dieta',
        handler: () => {
          this.database.list('usuario/'+this.llave+'/planes').remove(key);
          for(var i =0;i<this.ejercicioeliminar.length ; i++){
            this.database.list('usuario/'+this.llave+'/calendario').remove(this.ejercicioeliminar[i]);

          }


        }
      }
    ]
  });
  await action.present();

 }

}
