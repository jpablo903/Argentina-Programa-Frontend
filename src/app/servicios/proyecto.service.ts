import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Proyecto } from '../models/proyecto';

@Injectable({
  providedIn: 'root'
})
export class ProyectoService {

  proyectoUrl= "https://backargentinaprograma.herokuapp.com/proyecto/"

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable <Proyecto[]>{
    return this.httpClient.get<Proyecto[]>(`${this.proyectoUrl}lista`);
  }

  public detalle(id: number): Observable <Proyecto>{
    return this.httpClient.get<Proyecto>(`${this.proyectoUrl}detalle/${id}`);
  }

  public save(proyecto: Proyecto): Observable <Proyecto>{
    return this.httpClient.post<Proyecto>(`${this.proyectoUrl}crear`, proyecto);
  }
  
  public actualizar(id: number, proyecto: Proyecto): Observable <Proyecto>{
    return this.httpClient.put<Proyecto>(`${this.proyectoUrl}actualizar/${id}`, proyecto);
  }
      
  public eliminar(id: number): Observable <void>{
    return this.httpClient.delete<void>(`${this.proyectoUrl}eliminar/${id}`);
  }

}
