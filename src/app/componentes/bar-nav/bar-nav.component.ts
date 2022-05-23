import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginUsuario } from 'src/app/models/login-usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-bar-nav',
  templateUrl: './bar-nav.component.html',
  styleUrls: ['./bar-nav.component.css']
})
export class BarNavComponent implements OnInit {

      isLogged = false;
      isLoginFail = false;
      loginUsuario!: LoginUsuario;
      nombreUsuario!: string;
      password!: string;
      roles: string[] = [];
      errorMessage!: string;

  constructor(
    private tokenService: TokenService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router) { }

  ngOnInit(): void {
    if(this.tokenService.getToken()){
      this.isLogged = true;
    }else {
      this.isLogged = false;
    }
  

    if(this.tokenService.getToken()){
      this.isLogged = true;
      this.isLoginFail = false;
      this.roles = this.tokenService.getAuthorities();
    }
  }

      // Aqui va el codigo para resetear el formulario de registro
      
      
      
      

    onLogOut(): void {
      this.tokenService.logOut();
      window.location.reload();
      
    }
  
    onLogin(): void {
      this.loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
      this.authService.login(this.loginUsuario).subscribe({
        next: (data) => {
          this.isLogged = true;
          this.isLoginFail = false;
  
          this.tokenService.setToken(data.token);
          this.tokenService.setUserName(data.nombreUsuario);
          this.tokenService.setAuthorities(data.authorities);
          this.roles = data.authorities;
          this.toastr.success('Bienvenido ' + data.nombreUsuario, 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.router.navigate(['/']);
          window.location.reload();
        },
        error: (err) => {

          this.isLogged = false;
          this.isLoginFail = true;
          this.errorMessage = err.error.error;
          this.toastr.error(this.errorMessage, 'Fail', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
          console.log(err.error.error);
          
  
        }
      })
    }
  }


