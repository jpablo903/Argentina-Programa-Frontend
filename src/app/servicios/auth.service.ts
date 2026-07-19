import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { JwtDTO } from '../models/jwt-dto';
import { LoginUsuario } from '../models/login-usuario';
import { NuevoUsuario } from '../models/nuevo-usuario';
import { environment } from '../../environments/environment';

interface SessionData {
  nombreUsuario: string;
  authorities: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  authURL = `${environment.apiUrl}/auth/`;
  private sessionKey = 'auth-session';

  constructor(private httpClient: HttpClient) { }

  public nuevo(nuevoUsuario: NuevoUsuario): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'nuevo', nuevoUsuario);
  }

  public login(loginUsuario: LoginUsuario): Observable<JwtDTO> {
    return this.httpClient.post<JwtDTO>(this.authURL + 'login', loginUsuario, { withCredentials: true })
      .pipe(tap(res => this.persistSession(res)));
  }

  public logout(): Observable<any> {
    return this.httpClient.post<any>(this.authURL + 'logout', {}, { withCredentials: true })
      .pipe(tap(() => this.clearSession()));
  }

  public me(): Observable<SessionData | null> {
    return this.httpClient.get<JwtDTO>(this.authURL + 'me', { withCredentials: true }).pipe(
      tap(res => this.persistSession(res)),
      map(res => this.toSessionData(res)),
      catchError(() => {
        this.clearSession();
        return of(null);
      })
    );
  }

  public getSession(): SessionData | null {
    const raw = sessionStorage.getItem(this.sessionKey);
    if (!raw) return null;
    try {
      return JSON.parse(raw) as SessionData;
    } catch {
      return null;
    }
  }

  public getAuthorities(): string[] {
    return this.getSession()?.authorities ?? [];
  }

  public isLoggedIn(): boolean {
    return this.getSession() !== null;
  }

  public isAdmin(): boolean {
    return this.getAuthorities().some(a => a === 'ROLE_ADMIN');
  }

  private persistSession(jwt: JwtDTO): void {
    const session: SessionData = {
      nombreUsuario: jwt.nombreUsuario,
      authorities: (jwt.authorities ?? []).map(a => a.authority)
    };
    sessionStorage.setItem(this.sessionKey, JSON.stringify(session));
  }

  private clearSession(): void {
    sessionStorage.removeItem(this.sessionKey);
  }

  private toSessionData(jwt: JwtDTO): SessionData {
    return {
      nombreUsuario: jwt.nombreUsuario,
      authorities: (jwt.authorities ?? []).map(a => a.authority)
    };
  }
}
