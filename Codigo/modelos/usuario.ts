import { Dieta } from "./dieta";
import { PlanEjercicio } from "./planejercicio";
import { Evento } from "./evento";
import { Peso } from "./peso";
import { Caloria } from "./caloria";

export interface User{
    nombres:string;
    apellidos:string;
    email:string;
    password:string;
    edad: number;
    rol: number;
    peso: number;
    altura: number;
    genero: string;
    imc: number;
    estadofisico:string;
    meta:string;
    dietas: Dieta[];
    planes: PlanEjercicio[];
    pesos: Peso [];
    calorias: Caloria [];
    calendario: Evento[];
    neventor:number;
}