import { Ejercicio } from "./ejercicio";
export interface PlanEjercicio{
  key:string;
  genero: string;
  estadofisico: string;
    nombre:string;
    imagen:string;
    objetivo: string;
    ejercicios: Ejercicio[];
    visible:boolean;
    descripcion:string;
    vecesSeleccionado:number;
    duracion:number;
    vecesSeleccionadoMujer:number;
    vecesSeleccionadoHombre:number;
    vecesSeleccionadoBaja:number;
    vecesSeleccionadoMedia:number;
    vecesSeleccionadoAlta:number;
    vecesSeleccionadoMuyAlta:number;
}