import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Estudios } from '../models/estudios';

@Injectable({
  providedIn: 'root'
})
export class EstudiosService {

  estudiosUrl = "https://portfolio-backend-ev9h.onrender.com/estudios/";
   //estudiosUrl = "http://localhost:8080/estudios/";
  

  hpptOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json'
    })
  };

    constructor(private httpClient: HttpClient) { }

    public lista(): Observable <Estudios[]>{
      return this.httpClient.get<Estudios[]>(`${this.estudiosUrl}lista`);
    }

    public detalle(id: number): Observable <Estudios>{
      return this.httpClient.get<Estudios>(`${this.estudiosUrl}detalle/${id}`);
    }

    public save(estudio: Estudios): Observable <Estudios>{
      return this.httpClient.post<Estudios>(`${this.estudiosUrl}crear`, estudio);
    }

    public actualizar(id: number, estudio: Estudios): Observable <Estudios>{
      return this.httpClient.put<Estudios>(`${this.estudiosUrl}actualizar/${id}`, estudio);
    }
    
    public eliminar(id: number): Observable <void>{
      return this.httpClient.delete<void>(`${this.estudiosUrl}eliminar/${id}`);
}
}
