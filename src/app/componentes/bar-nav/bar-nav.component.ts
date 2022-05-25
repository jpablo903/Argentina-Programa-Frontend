import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { LoginUsuario } from 'src/app/models/login-usuario';
import { NuevoUsuario } from 'src/app/models/nuevo-usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-bar-nav',
  templateUrl: './bar-nav.component.html',
  styleUrls: ['./bar-nav.component.css']
})
export class BarNavComponent implements OnInit {
      public nuevo: NuevoUsuario[] = [];
      registerForm: FormGroup;
      loginForm: FormGroup;
  
      nuevoUsuario!: NuevoUsuario;
      nombre!: string;
      email!: string;
     
      isLogged = false;
      isLoginFail = false;
      loginUsuario!: LoginUsuario;
      nombreUsuario!: string;
      password!: string;
      roles: string[] = [];
      errorMessage!: string;

  constructor(
    private tokenService: TokenService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router) { 
      this.registerForm = this.formBuilder.group({
        nombre:['', [Validators.required]],
        nombreUsuario:['', [Validators.required, Validators.minLength(4)]],
        email:['', [Validators.required, Validators.email]],
        password:['', [Validators.required, Validators.minLength(6)]]
      })
      this.loginForm = this.formBuilder.group({
        nombreUsuario:['', [Validators.required, Validators.minLength(4)]],
        password:['', [Validators.required, Validators.minLength(6)]]
      })
    }

  ngOnInit() {
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
      private borrarForm() {
        this.registerForm.setValue({
          nombre:'',
          nombreUsuario:'',
          email:'',
          password:''
        });
      }

      onNewRegistro(){
        this.borrarForm();
      }
      
      
      

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
          this.errorMessage;
          this.toastr.error(this.errorMessage, 'Error de Usuario o Contraseña', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
          console.log(this.errorMessage + " Error de usuario o contraseña.");
        }
    })
    }

    onRegister(): void {
      this.nuevoUsuario = new NuevoUsuario(this.nombre, this.nombreUsuario, this.email, this.password);
      this.authService.nuevo(this.nuevoUsuario).subscribe({
        next: (data) => {
          this.toastr.success('Cuenta Creada', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
  
          this.router.navigate(['/']);
          window.location.reload();
        },
        error: (err) => {
          this.errorMessage= err.error.mensaje;
          this.toastr.error(this.errorMessage, 'Fail', {
            timeOut: 3000,  positionClass: 'toast-top-center',
          });
          console.log(err.error.message + " ERROR!");
        }
    });
    }

    get nombreValido(){
      return this.registerForm.get('nombre');
    }
    
    get nombreUsuarioValido(){
      return this.registerForm.get('nombreUsuario');
    }

    get emailValido(){
      return this.registerForm.get('email');
    }

    get passValido(){
      return this.registerForm.get('password');
    }

    get nombreUsuarioValidoL(){
      return this.loginForm.get('nombreUsuario');
    }

    get passValidoL(){
      return this.loginForm.get('password');
    }
  }