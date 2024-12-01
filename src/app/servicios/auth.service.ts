import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { JwtDTO } from '../models/jwt-dto';
import { LoginUsuario } from '../models/login-usuario';
import { NuevoUsuario } from '../models/nuevo-usuario';

@Injectable({
 providedIn: 'root'
})
export class AuthService {
 //authURL = 'http://localhost:8080/auth/';
 authURL = 'https://portfolio-backend-ev9h.onrender.com/auth/';
 private tokenKey = 'auth-token';
 private authoritiesKey = 'auth-authorities';
 private tokenExpirationKey = 'token-expiration';

 constructor(private httpClient: HttpClient) { }

 public nuevo(nuevoUsuario: NuevoUsuario): Observable<any> {
   return this.httpClient.post<any>(this.authURL + 'nuevo', nuevoUsuario);
 }

 public login(loginUsuario: LoginUsuario): Observable<JwtDTO> {
   return this.httpClient.post<JwtDTO>(this.authURL + 'login', loginUsuario);
 }

 // Métodos para manejar el token
 public get token(): string | null {
   if (this.isTokenExpired()) {
     this.logout();
     return null;
   }
   return sessionStorage.getItem(this.tokenKey);
 }

 public setToken(token: string): void {
   sessionStorage.setItem(this.tokenKey, token);
   // Token expira en 1 hora
   const expirationTime = new Date().getTime() + (60 * 60 * 1000);
   sessionStorage.setItem(this.tokenExpirationKey, expirationTime.toString());
 }

 private isTokenExpired(): boolean {
   const expiration = sessionStorage.getItem(this.tokenExpirationKey);
   if (!expiration) return true;
   return new Date().getTime() > parseInt(expiration);
 }

 // Métodos para manejar las autoridades
 public getAuthorities(): string[] {
   if (!sessionStorage.getItem(this.authoritiesKey)) {
     return [];
   }
   return JSON.parse(sessionStorage.getItem(this.authoritiesKey)!);
 }

 public setAuthorities(authorities: string[]): void {
   sessionStorage.setItem(this.authoritiesKey, JSON.stringify(authorities));
 }

 public logout(): void {
   sessionStorage.removeItem(this.tokenKey);
   sessionStorage.removeItem(this.authoritiesKey);
   sessionStorage.removeItem(this.tokenExpirationKey);
 }

 public isLoggedIn(): boolean {
   return this.token !== null && !this.isTokenExpired();
 }
}