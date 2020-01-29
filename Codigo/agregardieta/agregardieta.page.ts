import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { NavController, ActionSheetController, ToastController, AlertController, Platform, LoadingController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireList, snapshotChanges } from 'angularfire2/database';
import { database } from 'firebase';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Dieta } from '../modelos/dieta';
import { map } from 'rxjs/operators';
import { Plato } from '../modelos/plato';
import * as firebase from 'firebase';

@Component({
  selector: 'app-agregardieta',
  templateUrl: './agregardieta.page.html',
  styleUrls: ['./agregardieta.page.scss'],
})
export class AgregardietaPage implements OnInit {
  dieta = {} as Dieta;
  plato = {} as Plato;
  
  itemsRefDieta: AngularFireList<any>;
  itemsDieta: Observable<any[]>;
  
  itemsRefPlato: AngularFireList<any>;
  itemsPlato: Observable<any[]>;
  platosSeleccionados: Plato[] = [];
  llaves = [];
  items=[];
  usuario=[];

  todosplatos=[];
  desayuno=[];
  almuerzo=[];
  comida=[];
  merienda=[];
  usuarios=[];


  constructor(private loadingCtrl: LoadingController,public alertController: AlertController,public router: Router,public storage: Storage,public navCtrl: NavController, private database: AngularFireDatabase, private actionSheet: ActionSheetController) { 
    this.platosSeleccionados=[];
    this.itemsRefDieta = database.list('dieta');
    // Use snapshotChanges().map() to store the key
    this.itemsDieta = this.itemsRefDieta.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

    this.itemsRefPlato = database.list('plato');
    // Use snapshotChanges().map() to store the key
    this.itemsPlato = this.itemsRefPlato.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );

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

  async ngOnInit() {
        let loaderr = await this.loadingCtrl.create({});
        loaderr.present();
        this.getPlatos().then(async (y) => {
        loaderr.dismiss();
        if(y){
          console.log(this.todosplatos);
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


  getPlatos(){
    return new Promise((resolve) => {
        this.todosplatos=[];
        this.desayuno=[];
        this.almuerzo=[];
        this.comida=[];
        this.merienda=[];
      var p = firebase.database().ref().child('/plato');
      p.on("value",(snap)=>{
        let data = snap.val();
        for(var key in data){
          this.todosplatos.push(data[key]);  
          console.log(this.todosplatos);

        }
        resolve(true);
      });

    });
  }



  agregarPlato(){
    this.router.navigate(['/agregarplato',{ }]);
  }
  async nuevaDieta(dieta:Dieta){
    dieta.vecesSeleccionada=0;
    dieta.vecesSeleccionadaMujer=0;
    dieta.vecesSeleccionadaHombre=0;
    dieta.vecesSeleccionadaBaja=0;
    dieta.vecesSeleccionadaMedia=0;
    dieta.vecesSeleccionadaAlta=0;
    dieta.vecesSeleccionadaMuyAlta=0;
    if(this.platosSeleccionados.length===0){
      const alert = await this.alertController.create({
        header: 'Atención',
        message: 'Debe seleccionar al menos un plato.',
        buttons: ['OK']
      });
      await alert.present();
    }else{
      dieta.visible = false;
      const alert = await this.alertController.create({
        header: 'Atención',
        message: 'Se creó la dieta correctamente',
        buttons: ['OK']
      });
      await alert.present();
      this.dieta.objetivo=(<HTMLSelectElement>document.getElementById('meta')).value;
      var valorllave =this.itemsRefDieta.push(dieta).key;
      this.dieta.key=valorllave;
      this.database.list('dieta/').update(valorllave,this.dieta);

      for(var i=0;i<this.platosSeleccionados.length;i++){
        var llf = this.database.list('dieta/'+valorllave+'/platos').push(this.platosSeleccionados[i]).key;
        this.platosSeleccionados[i].key=llf;
        this.database.list('dieta/'+valorllave+'/platos/').update(llf,this.platosSeleccionados[i]);
        console.log(llf);
      }
       


    document.getElementById('inputnombre').setAttribute('value',"");
    document.getElementById('inputimagen').setAttribute('value',"");
    document.getElementById('inputduracion').setAttribute('value',"");
    document.getElementById('inputdescripcion').setAttribute('value',"");

    }
  }
  volver(){
    this.router.navigate(['/nutricionadmin',{ }]);
  }

  async elementoSeleccionado(plato:Plato,key:string){
    var texto="Agregar plato a la dieta";
    for(var i = 0;i<this.platosSeleccionados.length;i++) { 
      if(this.platosSeleccionados[i].nombre===plato.nombre){
        texto="Quitar plato de la dieta";
        break;
      }
    }
    const action = await this.actionSheet.create({
      header:`${plato.nombre}`,
      buttons: [
        {
          text: texto,
          handler: () =>{
            if(texto==="Agregar plato a la dieta"){
              this.platosSeleccionados.push(plato);
              this.llaves.push(key);
            }else{
              for(var i = 0;i<this.platosSeleccionados.length;i++) { 
                if(this.platosSeleccionados[i].nombre===plato.nombre){
                    this.platosSeleccionados.splice(i,1);
                    this.llaves.splice(i,1);
                }
              }
            }
          } 
         },
       {
          text: 'Eliminar',
          role: 'destructive',
          handler: () =>{
            this.itemsRefPlato.remove(key);
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
}
