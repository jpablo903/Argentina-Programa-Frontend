export interface Authority {
    authority: string;
}

export class JwtDTO {
    token: string;
    bearer: string;
    nombreUsuario: string;
    authorities: Authority[];

    constructor(token: string, nombreUsuario: string, authorities: Authority[]) {
        this.token = token;
        this.bearer = 'Bearer';
        this.nombreUsuario = nombreUsuario;
        this.authorities = authorities;
    }
}