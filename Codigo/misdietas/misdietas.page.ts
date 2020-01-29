import { Component, OnInit } from '@angular/core';
import { User } from 'firebase';
import { ActivatedRoute, Router } from '@angular/router';
import { AngularFireDatabase } from 'angularfire2/database';
import { Observable } from 'rxjs';
import * as firebase from 'firebase';
import { LoadingController, ActionSheetController } from '@ionic/angular';
import { Dieta } from '../modelos/dieta';

@Component({
  selector: 'app-misdietas',
  templateUrl: './misdietas.page.html',
  styleUrls: ['./misdietas.page.scss'],
})
export class MisdietasPage implements OnInit {
  emaile;
  email;
  dietaeliminar=[];
  usuarios=[];
  keys=[];
  usuario;
  llave;
  listaDietasRef$: Observable<any[]>


  constructor( private actionSheet: ActionSheetController,public router: Router,private loadingCtrl: LoadingController,private database: AngularFireDatabase,private route: ActivatedRoute) { 
    
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
        console.log('USUARIO '+this.usuario.email);
        console.log(this.llave);
        this.listaDietasRef$ = this.database.list('usuario/'+this.llave+'/dietas').valueChanges();
        var p = firebase.database().ref().child("/usuario/"+this.llave+"/calendario");
        p.on("value",(snap)=>{
          let data = snap.val();
          for(var key in data){
            console.log(data[key]);
              if(data[key].tipo==="dieta"){
                this.dietaeliminar.push(key);
              }
        }
        });
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

 async elementoSeleccionado(dieta:Dieta,key:string){
  console.log("hello");
  const action = await this.actionSheet.create({
    header:`${dieta.nombre}`,
    buttons: [
      {
        text: 'Ver platos de la dieta',
        handler: () => {
          this.router.navigate(['/verplatosmisdietas',{ dietaID: key, rol: 0, email: this.usuario.email, usuariokey:this.llave}]);
        }
      },
      {
        text: 'Dejar de seguir dieta',
        handler: () => {
          this.database.list('usuario/'+this.llave+'/dietas').remove(key);
          console.log('eliminar '+this.dietaeliminar);
          for(var i =0;i<this.dietaeliminar.length ; i++){
            this.database.list('usuario/'+this.llave+'/calendario').remove(this.dietaeliminar[i]);
          }

        }
      }
    ]
  });
  await action.present();

   //this.router.navigate(['/verplatosdietauser',{ dietaID: key, rol: 0, email: this.emaile}]);
 }
}
