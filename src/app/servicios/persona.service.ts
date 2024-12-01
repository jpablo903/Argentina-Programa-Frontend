import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Persona } from '../models/persona';

@Injectable({
  providedIn: 'root'
})
export class PersonaService {

  personaUrl = "https://portfolio-backend-ev9h.onrender.com/persona/";
   //personaUrl = "http://localhost:8080/persona/";
  

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable <Persona[]>{
    return this.httpClient.get<Persona[]>(`${this.personaUrl}lista`);
  }

  public detalle(id: number): Observable <Persona>{
    return this.httpClient.get<Persona>(`${this.personaUrl}detalle/${id}`);
  }

  public save(persona: Persona): Observable <Persona>{
    return this.httpClient.post<Persona>(`${this.personaUrl}crear`, persona);
  }

  public actualizar(id: number, persona: Persona): Observable <Persona>{
    return this.httpClient.put<Persona>(`${this.personaUrl}actualizar/${id}`, persona);
  }

  public eliminar(id: number): Observable <void>{
    return this.httpClient.delete<void>(`${this.personaUrl}eliminar/${id}`);
  }

}
