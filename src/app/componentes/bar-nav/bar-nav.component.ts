import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { LoginUsuario } from 'src/app/models/login-usuario';
import { AuthService } from 'src/app/servicios/auth.service';
import { JwtDTO } from 'src/app/models/jwt-dto';
import { AuthStateService } from 'src/app/shared/auth-state.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginDialogComponent } from 'src/app/dialogs/login-dialog/login-dialog.component';


@Component({
    selector: 'app-bar-nav',
    templateUrl: './bar-nav.component.html',
    styleUrls: ['./bar-nav.component.css'],
    standalone: false
})
export class BarNavComponent implements OnInit {
  @ViewChild('loginDialog') loginDialog!: TemplateRef<any>;
  loginForm: FormGroup;
  isLogged = false;
  isAdmin = false;
  nombreUsuario: string = '';
  password: string = '';
  roles: string[] = [];
  private dialogRef: MatDialogRef<LoginDialogComponent> | null = null;

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private authStateService: AuthStateService,
    private dialog: MatDialog,
    private iconRegistry: MatIconRegistry,
    private sanitizer: DomSanitizer,
  ) {
    this.loginForm = this.formBuilder.group({
      nombreUsuario: ['', [Validators.required, Validators.minLength(4)]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
    this.registerIcons();
  }

  private registerIcons() {
    this.iconRegistry.addSvgIcon(
      'facebook',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/facebook-brands.svg')
    );
    this.iconRegistry.addSvgIcon(
      'twitter',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/twitter-brands.svg')
    );
    this.iconRegistry.addSvgIcon(
      'github',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/git-alt-brands.svg')
    );
    this.iconRegistry.addSvgIcon(
      'linkedin',
      this.sanitizer.bypassSecurityTrustResourceUrl('../assets/linkedin-brands.svg')
    );
  }

  // Getters para las validaciones del formulario
  get nombreUsuarioValidoL() {
    return this.loginForm.get('nombreUsuario');
  }

  get passValidoL() {
    return this.loginForm.get('password');
  }

  ngOnInit() {
    if (this.authService.token) {
      this.isLogged = true;
      this.roles = this.authService.getAuthorities();
      this.checkUserRole();
    }
  }

  openLogin(): void {
    if (this.dialogRef) return;

    this.dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '400px',
      disableClose: false,
      panelClass: 'login-dialog-container',
    });

    this.dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const loginUsuario = new LoginUsuario(result.nombreUsuario, result.password);
        this.authService.login(loginUsuario).subscribe({
          next: (data: JwtDTO) => {
            this.isLogged = true;
            this.authService.setToken(data.token);
            this.authService.setAuthorities(data.authorities.map(auth => auth.authority));
            this.roles = this.authService.getAuthorities();
            this.checkUserRole();
            this.toastr.success('Bienvenido ' + result.nombreUsuario, 'OK');
          },
          error: (err) => {
            this.isLogged = false;
            this.toastr.error('Usuario o contraseña incorrectos', 'Error');
          }
        });
      }
      this.dialogRef = null;
    });
  }

  onLogin() {
    const loginUsuario = new LoginUsuario(this.nombreUsuario, this.password);
    this.authService.login(loginUsuario).subscribe({
      next: (data: JwtDTO) => {
        this.isLogged = true;
        this.authService.setToken(data.token);
        this.authService.setAuthorities(data.authorities.map(auth => auth.authority));
        this.roles = this.authService.getAuthorities();
        this.checkUserRole();
        this.toastr.success('Bienvenido ' + this.nombreUsuario, 'OK', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
        window.location.reload();
      },
      error: (err) => {
        this.isLogged = false;
        this.toastr.error('Usuario o contraseña incorrectos', 'Error', {
          timeOut: 3000,
          positionClass: 'toast-top-center'
        });
      }
    });
  }

  private checkUserRole() {
    this.roles.forEach(role => {
      if (role === 'ROLE_ADMIN') {
        this.isAdmin = true;
        this.authStateService.setAdminState(true);
      }
    });
  }

  onLogOut(): void {
    this.authService.logout();
    this.isLogged = false;
    this.isAdmin = false;
    this.authStateService.setAdminState(false);
    window.location.reload();
  }
}