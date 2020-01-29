import { Plato } from "./plato";

export interface Dieta{
    key:string;
    nombre:string;
    imagen:string;
    objetivo: string;
    platos: Plato[];
    visible:boolean;
    vecesSeleccionada:number;
    duracion:number;
    descripcion:string;
    calorias:number;
    vecesSeleccionadaMujer:number;
    vecesSeleccionadaHombre:number;
    vecesSeleccionadaBaja:number;//menos de 20
    vecesSeleccionadaMedia:number;//entre 20-30
    vecesSeleccionadaAlta:number;//entre 30-40
    vecesSeleccionadaMuyAlta:number;//mas de 40
}