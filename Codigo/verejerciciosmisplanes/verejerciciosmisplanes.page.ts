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
  selector: 'app-verejerciciosmisplanes',
  templateUrl: './verejerciciosmisplanes.page.html',
  styleUrls: ['./verejerciciosmisplanes.page.scss'],
})
export class VerejerciciosmisplanesPage implements OnInit {


  nombre;
  key;
  rol;
  email;


usuariokey;
  listaEjerciciosRef$: Observable<any[]>
  constructor(private loadingCtrl: LoadingController,public alertController: AlertController,public router: Router,private route: ActivatedRoute,public storage: Storage,public navCtrl: NavController, private database: AngularFireDatabase) {   
    let sub = this.route.params.subscribe(params => {
      this.key= params['planID'];
      this.rol=params['rol'];
      this.email=params['email'];
      this.usuariokey=params['usuariokey'];

    });
    console.log(this.key);
    console.log(this.rol);
    this.listaEjerciciosRef$ = this.database.list('usuario/'+this.usuariokey+'/planes/'+this.key+'/ejercicios').valueChanges();

  }
  ngOnInit() {
   
  }
}