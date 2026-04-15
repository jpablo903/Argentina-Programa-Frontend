import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

// Validador personalizado para prevenir inyección de scripts
function noScriptTags(control: any): { [key: string]: boolean } | null {
  const value = control.value;
  if (typeof value !== 'string') return null;
  
  const dangerousPatterns = [
    /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,
    /javascript:/gi,
    /on\w+\s*=/gi,
    /<[^>]+>/g
  ];
  
  for (const pattern of dangerousPatterns) {
    if (pattern.test(value)) {
      return { invalidCharacters: true };
    }
  }
  return null;
}

// Validador para caracteres permitidos (alfanuméricos y algunos especiales)
function validUsername(control: any): { [key: string]: boolean } | null {
  const value = control.value;
  if (typeof value !== 'string') return null;
  
  // Solo permite letras, números, guiones bajos y puntos
  const validPattern = /^[a-zA-Z0-9._]+$/;
  if (value && !validPattern.test(value)) {
    return { invalidUsername: true };
  }
  return null;
}

@Component({
    selector: 'app-login-dialog',
    templateUrl: './login-dialog.component.html',
    styleUrls: ['./login-dialog.component.css'],
    standalone: false
})
export class LoginDialogComponent {
  loginForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<LoginDialogComponent>
  ) {
    this.loginForm = this.fb.group({
      nombreUsuario: ['', [
        Validators.required, 
        Validators.minLength(4),
        Validators.maxLength(50),
        validUsername,
        noScriptTags
      ]],
      password: ['', [
        Validators.required, 
        Validators.minLength(6),
        Validators.maxLength(100),
        noScriptTags
      ]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      // Sanitizar entrada antes de enviar
      const sanitizedValue = {
        nombreUsuario: this.sanitizeInput(this.loginForm.value.nombreUsuario),
        password: this.loginForm.value.password
      };
      this.dialogRef.close(sanitizedValue);
    }
  }

  private sanitizeInput(input: string): string {
    if (typeof input !== 'string') return '';
    return input
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#x27;')
      .trim();
  }

  // Método para obtener mensajes de error
  getErrorMessage(field: string): string {
    const control = this.loginForm.get(field);
    if (control?.hasError('required')) {
      return 'Este campo es requerido';
    }
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength']?.requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (control?.hasError('maxlength')) {
      return 'Excede el límite de caracteres';
    }
    if (control?.hasError('invalidUsername')) {
      return 'Solo se permiten letras, números, puntos y guiones bajos';
    }
    if (control?.hasError('invalidCharacters')) {
      return 'Caracteres no permitidos detectados';
    }
    return '';
  }
}