import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Experiencia } from '../models/experiencia';

@Injectable({
  providedIn: 'root'
})
export class ExperienciaService {

  experienciaUrl = "https://portfolio-backend-ev9h.onrender.com/experiencia/";
   //experienciaUrl = "http://localhost:8080/experiencia/";
  

  hpptOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable <Experiencia[]>{
    return this.httpClient.get<Experiencia[]>(`${this.experienciaUrl}lista`);
  }

  public detalle(id: number): Observable <Experiencia>{
    return this.httpClient.get<Experiencia>(`${this.experienciaUrl}detalle/${id}`);
  }

  public save(experiencia: Experiencia): Observable <Experiencia>{
    return this.httpClient.post<Experiencia>(`${this.experienciaUrl}crear`, experiencia);
  }

  public actualizar(id: number, experiencia: Experiencia): Observable <Experiencia>{
    return this.httpClient.put<Experiencia>(`${this.experienciaUrl}actualizar/${id}`, experiencia);
  }

  public eliminar(id: number): Observable <void>{
    return this.httpClient.delete<void>(`${this.experienciaUrl}eliminar/${id}`);

  } 

}
