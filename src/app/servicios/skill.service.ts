import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Skill } from '../models/skill';

@Injectable({
  providedIn: 'root'
})
export class SkillService {

  skillUrl= "https://backargentinaprograma.herokuapp.com/skill/";

  constructor(private httpClient: HttpClient) { }

  public lista(): Observable <Skill[]>{
    return this.httpClient.get<Skill[]>(`${this.skillUrl}lista`);
  }

  public detalle(id: number): Observable <Skill>{
    return this.httpClient.get<Skill>(`${this.skillUrl}detalle/${id}`);
  }

  public save(skill: Skill): Observable <Skill>{
    return this.httpClient.post<Skill>(`${this.skillUrl}crear`, skill);
  }
  
  public actualizar(id: number, skill: Skill): Observable <Skill>{
    return this.httpClient.put<Skill>(`${this.skillUrl}actualizar/${id}`, skill);
  }
      
  public eliminar(id: number): Observable <void>{
    return this.httpClient.delete<void>(`${this.skillUrl}eliminar/${id}`);
  }
}
