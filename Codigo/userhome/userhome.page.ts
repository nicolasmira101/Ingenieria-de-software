import { Component, OnInit, ViewChild,Inject, LOCALE_ID  } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { NavController, ActionSheetController, MenuController, PopoverController, LoadingController } from '@ionic/angular';
import { AngularFireDatabase, AngularFireList, snapshotChanges, AngularFireAction } from 'angularfire2/database';
import { database, User } from 'firebase';
import { AlertController } from '@ionic/angular';
import { Router, ActivatedRoute } from '@angular/router';
import { Storage } from '@ionic/storage';
import { Dieta } from '../modelos/dieta';
import { map, switchMap } from 'rxjs/operators';
import { CalendarComponent } from 'ionic2-calendar/calendar';
import { formatDate } from '@angular/common';
import { NutricionPage } from '../nutricion/nutricion.page';
import { PopoPage } from '../popo/popo.page';
import { PopopesoPage } from '../popopeso/popopeso.page';

import * as firebase from 'firebase';
import { Evento } from '../modelos/evento';



@Component({
  selector: 'app-userhome',
  templateUrl: './userhome.page.html',
  styleUrls: ['./userhome.page.scss'],
})
export class UserhomePage implements OnInit {

  event = {
    title: '',
    desc: '',
    startTime: '',
    endTime: '',
    allDay: false
  };
 
  minDate = new Date().toISOString();
 
  eventSource = [];
  viewTitle;
 
  calendar = {
    mode: 'month',
    currentDate: new Date(),
  };

  emaile;
  usuario = {} as User;
  ev = {} as Evento;

  users=[];
  user=[];
  gen;

  calen=[];

  keys=[];
  llaveUsuario;

  itemsRefUsuario: AngularFireList<any>;
  itemsUsuario: Observable<any[]>;

  usuario$: Observable<AngularFireAction<firebase.database.DataSnapshot>[]>;
  email$: BehaviorSubject<string|null>;

  @ViewChild(CalendarComponent) myCal: CalendarComponent;


  constructor(private loadingCtrl: LoadingController,public popoverController: PopoverController,private alertCtrl: AlertController, @Inject(LOCALE_ID) private locale: string,public router: Router,private database: AngularFireDatabase,private route: ActivatedRoute,private menu: MenuController,public navCtrl: NavController) { 
    
    let sub = this.route.params.subscribe(params => {
      this.emaile = params['userEmail'];
     });
     this.usuario.email=this.emaile;
  
    this.email$ = new BehaviorSubject(null);
    this.usuario$ = this.email$.pipe(
      switchMap(email => 
        database.list('/usuario', ref =>
         email ? ref.orderByChild('email').equalTo(email) : ref
        ).snapshotChanges()
      )
    );
    
    this.email$.next(this.usuario.email);
    
    console.log(this.email$.getValue());
    console.log(this.usuario$);

     this.itemsRefUsuario = database.list('usuario');
     this.itemsUsuario = this.itemsRefUsuario.snapshotChanges().pipe(
      map(changes => 
        changes.map(c => ({ key: c.payload.key, ...c.payload.val() }))
      )
    );
  }

  actualizarCalen(){
    this.ngOnInit();
  }
  async presentPopover(ev: any) {
    const popover = await this.popoverController.create({
      component: PopoPage,
      componentProps:{
        customemail:this.emaile
      },
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  async presentPopoverr(ev: any) {
    const popover = await this.popoverController.create({
      component: PopopesoPage,
      componentProps:{
        customemail:this.emaile
      },
      event: ev,
      translucent: true
    });
    return await popover.present();
  }

  getUsuario(){
    return new Promise((resolve) => {
      this.users=[];
      var p = firebase.database().ref().child("/usuario");
      p.on("value",(snap)=>{
        let data = snap.val();
        for(var key in data){
          this.users.push(data[key]);  
          this.keys.push(key);
        }
        resolve(true);
      });

    });
  }
  getCalendario(){
    return new Promise((resolve) => {
      this.calen=[];
      var p = firebase.database().ref().child("/usuario/"+this.llaveUsuario+"/calendario");
      p.on("value",(snap)=>{
        let data = snap.val();
        for(var key in data){
          this.calen.push(data[key]);  
                }
        resolve(true);
      });

    });
  }


  async ngOnInit() {
    this.resetEvent();
    this.user=[];
    return new Promise(async (resolve) => {
     let loader = await this.loadingCtrl.create({});
     loader.present();
     this.getUsuario().then((x) => {
       if(x){
         for(var i=0;i<this.users.length;i++){
           if(this.users[i].email===this.emaile){
             this.user.push(this.users[i]);
             this.llaveUsuario=this.keys[i];
           }
         }
         this.gen=this.user[0].genero;
         loader.dismiss();
         resolve(true);
         return new Promise(async (resolve) => {
          let loaderr = await this.loadingCtrl.create({});
          loaderr.present();
          this.eventSource=[];
          this.getCalendario().then((y) => {
            if(y){
              for(var i=0;i<this.calen.length;i++){
                let eventCopy = {
                  title: this.calen[i].title,
                  startTime:  new Date(this.calen[i].endTime),
                  endTime: new Date(this.calen[i].startTime),
                  allDay: this.calen[i].allDay,
                  desc: this.calen[i].desc
                }
                console.log(eventCopy);
                  this.eventSource.push(eventCopy);
              }
              console.log(this.eventSource);
              this.myCal.loadEvents();
              loaderr.dismiss();
              resolve(true);
            }
          });
          
        });
       }
     });
   });

  }

  resetEvent() {
    this.event = {
      title: '',
      desc: '',
      startTime: new Date().toISOString(),
      endTime: new Date().toISOString(),
      allDay: false
    };
  }
 
  // Create the right event format and reload source
  addEvent() {
    console.log(this.event.startTime);
    let eventCopy = {
      title: this.event.title,
      startTime:  new Date(this.event.startTime),
      endTime: new Date(this.event.endTime),
      allDay: this.event.allDay,
      desc: this.event.desc
    }
 
    if (eventCopy.allDay) {
      let start = eventCopy.startTime;
      let end = eventCopy.endTime;
 
      eventCopy.startTime = new Date(Date.UTC(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate()));
      eventCopy.endTime = new Date(Date.UTC(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate() + 1));
    }

    this.ev.desc=eventCopy.desc;
    this.ev.title=eventCopy.title;
    this.ev.startTime=eventCopy.startTime.toISOString();
    this.ev.endTime=eventCopy.endTime.toISOString();
    this.ev.allDay=eventCopy.allDay;
    let llf=this.database.list('usuario/'+this.llaveUsuario+'/calendario').push(this.ev).key;  
    this.eventSource.push(eventCopy);
    this.myCal.loadEvents();
    this.resetEvent();
  }



  miProgresoClick(){
    this.router.navigate(['/misgraficas',{ userEmail: this.usuario.email}]); 
  }

  nutricionUserClick(){
    this.router.navigate(['/nutricion',{ userEmail: this.usuario.email}]);  }
  micuentaClick(){
    this.router.navigate(['/micuenta',{ userEmail: this.usuario.email}]);
  }
misdietasClick(){
  this.router.navigate(['/misdietas',{ userEmail: this.usuario.email}]);

}
misplanesClick(){
  this.router.navigate(['/misplanes',{ userEmail: this.usuario.email}]);

}
  ejercicioClick(){
    this.router.navigate(['/ejercicio',{ userEmail: this.usuario.email}]);  
  }

  salir(){
    this.navCtrl.navigateForward('login');
  }

  next() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slideNext();
  }
   
  back() {
    var swiper = document.querySelector('.swiper-container')['swiper'];
    swiper.slidePrev();
  }
   
  // Change between month/week/day
  changeMode(mode) {
    this.calendar.mode = mode;
  }
   
  // Focus today
  today() {
    this.calendar.currentDate = new Date();
  }
   
  // Selected date reange and hence title changed
  onViewTitleChanged(title) {
    this.viewTitle = title;
  }
   
  // Calendar event was clicked
  async onEventSelected(event) {
    // Use Angular date pipe for conversion
    let start = formatDate(event.startTime, 'medium', this.locale);
    let end = formatDate(event.endTime, 'medium', this.locale);
   
    const alert = await this.alertCtrl.create({
      header: event.title,
      subHeader: event.desc,
      message: 'From: ' + start + '<br><br>To: ' + end,
      buttons: ['OK']
    });
    alert.present();
  }
   
  // Time slot was clicked
  onTimeSelected(ev) {
    let selected = new Date(ev.selectedTime);
    this.event.startTime = selected.toISOString();
    selected.setHours(selected.getHours() + 1);
    this.event.endTime = (selected.toISOString());
  }
}
