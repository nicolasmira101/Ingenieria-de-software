import { Component, OnInit, ViewChild } from '@angular/core';
import { NavController,LoadingController, ActionSheetController, MenuController } from '@ionic/angular';
import { Dieta } from '../modelos/dieta';  
import { AngularFireDatabase, AngularFireList, AngularFireAction } from 'angularfire2/database';
import { Observable, BehaviorSubject, generate } from 'rxjs';
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
  selector: 'app-reporteadmin',
  templateUrl: './reporteadmin.page.html',
  styleUrls: ['./reporteadmin.page.scss'],
})
export class ReporteadminPage implements OnInit {
 

  @ViewChild('barCanvas') barCanvas;
  @ViewChild('barCanvasE') barCanvasE;
    @ViewChild('doughnutCanvas') doughnutCanvas;
    @ViewChild('doughnutCanvasG') doughnutCanvasG;
    @ViewChild('lineCanvas') lineCanvas;
    @ViewChild('lineCanvasE') lineCanvasE;
    barChart: any;
    barChartE: any;
    doughnutChart: any;
    doughnutChartG: any;
    lineChart: any;
    lineChartE: any;
  
genero=[];
generon=[];
  dietas=[];
  nombredietas=[];
  nombrePlanes=[];

  vecesSelec=[];
  vecesSelecE=[];

  vecesSelecHombre=[];
  
  vecesSelecEdad=[];
  vecesSelecBaja;
  vecesSelecMedia;
  vecesSelecAlta;
  vecesSelecMuyAlta;


  vecesSelecBajaE;
  vecesSelecMediaE;
  vecesSelecAltaE;
  vecesSelecMuyAltaE;
  
  hombres;
  mujeres;

  hombresE;
  mujeresE;
  planes=[];
  generoe=[];
  vecesSelecPlan=[];

edades=[];

  show: boolean = false;
  constructor(private loadingCtrl: LoadingController,public storage: Storage,private actionSheet: ActionSheetController,public router: Router,private database: AngularFireDatabase,private route: ActivatedRoute,private menu: MenuController,public navCtrl: NavController) {
    this.genero[0]="Masculino";
    this.genero[1]="Femenino";

    this.edades[0]="Menos de 20 años";
    this.edades[1]="Entre 20 y 29 años";
    this.edades[2]="Entre 30 y 39 años";
    this.edades[3]="Mayor o igual a 40 años";
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

   getPlanes(){
    return new Promise((resolve) => {
    var that=this;
    this.planes=[];
      var p = firebase.database().ref().child("/planejercicio");
      p.on("value",(snap)=>{
        let data = snap.val();
        for(var key in data){
          this.planes.push(data[key]);  
          resolve(true);
        }
      });
      });

   }

   async ngOnInit() {    
    let loader = await this.loadingCtrl.create({});
    loader.present();
    console.log('espera0');
    this.getDietas().then(async (x) => {
      console.log('esperaaa');
      if (x) {
        console.log('esperita');
        loader.dismiss();
        this.nombredietas=[];
        this.vecesSelec=[];
        this.hombres=0;
        this.mujeres=0;
        this.vecesSelecBaja=0;
        this.vecesSelecMedia=0;
        this.vecesSelecAlta=0;
        this.vecesSelecMuyAlta=0;
        for(var i=0;i<this.dietas.length;i++){
          this.nombredietas.push(this.dietas[i].nombre);
          this.vecesSelec.push(this.dietas[i].vecesSeleccionada); 

          this.vecesSelecBaja+=this.dietas[i].vecesSeleccionadaBaja;
          this.vecesSelecMedia+=this.dietas[i].vecesSeleccionadaMedia;
          this.vecesSelecAlta+=this.dietas[i].vecesSeleccionadaAlta;
          this.vecesSelecMuyAlta+=this.dietas[i].vecesSeleccionadaMuyAlta;
          this.mujeres+=this.dietas[i].vecesSeleccionadaMujer;
          this.hombres+=this.dietas[i].vecesSeleccionadaHombre;
        }
        this.generon.push(this.hombres);
        this.generon.push(this.mujeres);

        this.vecesSelecEdad.push(this.vecesSelecBaja);
        this.vecesSelecEdad.push(this.vecesSelecMedia);
        this.vecesSelecEdad.push(this.vecesSelecAlta);
        this.vecesSelecEdad.push(this.vecesSelecMuyAlta);

        console.log(this.generon);
        console.log(this.generon);

        let loaderr = await this.loadingCtrl.create({});
        loaderr.present();
        console.log('espera1');
        this.getPlanes().then((y) => {
          if (y) {
            loaderr.dismiss();
            this.nombrePlanes=[];
            this.vecesSelecPlan=[];
            this.hombresE=0;
            this.mujeresE=0;
            this.vecesSelecBajaE=0;
            this.vecesSelecMediaE=0;
            this.vecesSelecAltaE=0;
            this.vecesSelecMuyAltaE=0;
            for(var i=0;i<this.planes.length;i++){
              this.nombrePlanes.push(this.planes[i].nombre);
              this.vecesSelecPlan.push(this.planes[i].vecesSeleccionado);
              this.hombresE+= this.planes[i].vecesSeleccionadoHombre;
              this.mujeresE+= this.planes[i].vecesSeleccionadoMujer;
              this.vecesSelecBajaE+=this.planes[i].vecesSeleccionadoBaja;
              this.vecesSelecMediaE+=this.planes[i].vecesSeleccionadoMedia;
              this.vecesSelecAltaE+=this.planes[i].vecesSeleccionadoAlta;
              this.vecesSelecMuyAltaE+=this.planes[i].vecesSeleccionadoMuyAlta;
            }
            this.generoe.push(this.hombresE);
            this.generoe.push(this.mujeresE);
            this.vecesSelecE.push(this.vecesSelecBajaE);
            this.vecesSelecE.push(this.vecesSelecMediaE);
            this.vecesSelecE.push(this.vecesSelecAltaE);
            this.vecesSelecE.push(this.vecesSelecMuyAltaE);
            console.log('espera2');
        console.log(this.vecesSelec);  
        this.barChart = new Chart(this.barCanvas.nativeElement, {
          type: 'bar',
          data: {
              labels: this.edades,
              datasets: [{
                  label: 'Veces seleccionados por edad',
                  data: this.vecesSelecEdad,
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

      this.barChartE = new Chart(this.barCanvasE.nativeElement, {
        type: 'bar',
        data: {
            labels: this.edades,
            datasets: [{
                label: 'Veces seleccionados por edad',
                data: this.vecesSelecE,
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


      this.doughnutChartG = new Chart(this.doughnutCanvasG.nativeElement, {
    
        type: 'doughnut',
        data: {
            labels: this.genero,
            datasets: [{
                label: 'Veces seleccionada por género',
                data: this.generon,
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

        this.doughnutChart = new Chart(this.doughnutCanvas.nativeElement, {
    
          type: 'doughnut',
          data: {
              labels: this.genero,
              datasets: [{
                  label: 'Veces seleccionada por género',
                  data: this.generoe,
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
      console.log(this.vecesSelec);

      this.lineChart = new Chart(this.lineCanvas.nativeElement, {
    
        type: 'line',
        data: {
            labels: this.nombredietas,
            datasets: [
                {
                    label: 'Veces seleccionada por los usuarios',
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
                    data: this.vecesSelec,
                    spanGaps: false,
                }
            ]
        }
    });


    this.lineChartE = new Chart(this.lineCanvasE.nativeElement, {
    
      type: 'line',
      data: {
          labels: this.nombrePlanes,
          datasets: [
              {
                  label: 'Veces seleccionados por los usuarios',
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
                  data: this.vecesSelecPlan,
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
    
}
