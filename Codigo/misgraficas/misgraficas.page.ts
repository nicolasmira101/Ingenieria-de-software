import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController,LoadingController, ActionSheetController, MenuController } from '@ionic/angular';
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
import { Chart } from 'chart.js';


@Component({
  selector: 'app-misgraficas',
  templateUrl: './misgraficas.page.html',
  styleUrls: ['./misgraficas.page.scss'],
})
export class MisgraficasPage implements OnInit {

  @ViewChild('barCanvas') barCanvas;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('lineCanvas') lineCanvas;
    usuario=[];
    llaveUsuario;
    pesos=[];
    fechas=[];
    calo=[];
    fechas2=[];

    usuarios=[];
    keys=[];
    barChart: any;
    doughnutChart: any;
    lineChart: any;
  dietas=[];
  nombredietas=[];
  vecesSelec=[];
  show: boolean = false;
  emaile;
  items=[];
imcs=[];
  graficas=[];
  constructor(private loadingCtrl: LoadingController,public storage: Storage,private actionSheet: ActionSheetController,public router: Router,private database: AngularFireDatabase,private route: ActivatedRoute,private menu: MenuController,public navCtrl: NavController) {
    let sub = this.route.params.subscribe(params => {
      this.emaile = params['userEmail'];
       console.log(params['userEmail']); 
     });


     this.items = [
      { expanded: false,
        nombre:'Gráfica de imc desde el registro'
      },
      { expanded: false,
        nombre:'Gráfica de calorías por dieta seleccionada' },
      { expanded: false,
        nombre:'Gráfica de pesos desde el registro' },
    ];

  }

  actualizar(){
    this.ngOnInit();
  }
   getDietas(){
    return new Promise((resolve) => {
      var that=this;
    this.dietas=[];
    this.nombredietas=[];
    this.vecesSelec=[];
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
      
      console.log(this.nombredietas);
      console.log(this.vecesSelec);
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

  getPesos(){
    return new Promise((resolve) => {
      this.pesos=[];
      var p = firebase.database().ref().child("/usuario/"+this.llaveUsuario+"/pesos");
      p.on("value",(snap)=>{
        let data = snap.val();
        for(var key in data){
          this.imcs.push(data[key].imc);
          this.pesos.push(data[key].pes);
          this.fechas.push(data[key].fecha);  
        }
        console.log(this.pesos)
        resolve(true);
      });

    });
  }

  getCalorias(){
    return new Promise((resolve) => {
      this.calo=[];
      var p = firebase.database().ref().child("/usuario/"+this.llaveUsuario+"/calorias");
      p.on("value",(snap)=>{
        let data = snap.val();
        for(var key in data){
          this.calo.push(data[key].pes);
          this.fechas2.push(data[key].fecha);  
       }
        resolve(true);
      });

    });
  }

   async ngOnInit() {    
    let loader = await this.loadingCtrl.create({});
    loader.present();
    this.getUsuario().then(async (x) => {
      if (x) {
        loader.dismiss();
        this.nombredietas=[];
        this.vecesSelec=[];
        for(var i=0;i<this.usuarios.length;i++){
          if(this.usuarios[i].email===this.emaile){
            this.usuario.push(this.usuarios[i]);
            this.llaveUsuario=this.keys[i];
          }
        }
        let loaderr = await this.loadingCtrl.create({});
        loaderr.present();
        this.getPesos().then(async (y) => {
          if (y) {
            loaderr.dismiss();
            let loaderrr = await this.loadingCtrl.create({});
            loaderrr.present();
            this.getCalorias().then((z) => {
              if (z) {
                
                loaderrr.dismiss();
                console.log(this.pesos)
                this.barChart = new Chart(this.barCanvas.nativeElement, {
                  type: 'bar',
                  data: {
                      labels: this.fechas,
                      datasets: [{
                          label: 'Pesos desde el registro',
                          data: this.imcs,
                          backgroundColor: [
                              'rgba(255, 99, 132, 0.2)',
                              'rgba(54, 162, 235, 0.2)',
                              'rgba(255, 206, 86, 0.2)',
                              'rgba(75, 192, 192, 0.2)',
                              'rgba(153, 102, 255, 0.2)',
                              'rgba(255, 159, 64, 0.2)'
                          ],
                          borderColor: [
                              'rgba(255,99,132,1)',
                              'rgba(54, 162, 235, 1)',
                              'rgba(255, 206, 86, 1)',
                              'rgba(75, 192, 192, 1)',
                              'rgba(153, 102, 255, 1)',
                              'rgba(255, 159, 64, 1)'
                          ],
                          borderWidth: 1
                      }]
                  },
                  options: {
                      scales: {
                          yAxes: [{
                              ticks: {
                                  beginAtZero:true
                              }
                          }]
                      }
                  }
            
              });
            
                this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
            
                  type: 'doughnut',
                  data: {
                      labels: this.fechas2,
                      datasets: [{
                          label: 'Pesos desde el registro',
                          data: this.calo,
                          backgroundColor: [
                              'rgba(255, 99, 132, 0.2)',
                              'rgba(54, 162, 235, 0.2)',
                              'rgba(255, 206, 86, 0.2)',
                              'rgba(75, 192, 192, 0.2)',
                              'rgba(153, 102, 255, 0.2)',
                              'rgba(255, 159, 64, 0.2)'
                          ],
                          hoverBackgroundColor: [
                              "#FF6384",
                              "#36A2EB",
                              "#FFCE56",
                              "#FF6384",
                              "#36A2EB",
                              "#FFCE56"
                          ]
                      }]
                  }
              
              });
            
              this.lineChart = new Chart(this.lineCanvas.nativeElement, {
            
                type: 'line',
                data: {
                    labels: this.fechas,
                    datasets: [
                        {
                            label: 'Pesos desde el registro',
                            fill: false,
                            lineTension: 0.1,
                            backgroundColor: "rgba(75,192,192,0.4)",
                            borderColor: "rgba(75,192,192,1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(75,192,192,1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 1,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(75,192,192,1)",
                            pointHoverBorderColor: "rgba(220,220,220,1)",
                            pointHoverBorderWidth: 2,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: this.pesos,
                            spanGaps: false,
                        }
                    ]
                }
            
            });
              
            }
            });
          }
        });
      }
    
  });
    
    }
}
