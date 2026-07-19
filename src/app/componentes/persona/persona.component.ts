import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/servicios/persona.service';
import { AuthStateService } from 'src/app/shared/auth-state.service';
import { UrlValidatorService } from 'src/app/shared/url-validator.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-persona',
    templateUrl: './persona.component.html',
    styleUrls: ['./persona.component.css'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class PersonaComponent implements OnInit, OnDestroy {
  @ViewChild('personaDialog') personaDialog!: TemplateRef<any>;
  public personas: Persona[] = [];
  acercaDeForm: FormGroup;
  isAdmin: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(
    private personaService: PersonaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authStateService: AuthStateService,
    private dialog: MatDialog,
    private urlValidator: UrlValidatorService
  ) {
    this.acercaDeForm = this.formBuilder.group({
      id: [''],
      nombre: ['', [Validators.required]],
      apellido: ['', [Validators.required]],
      profesion: ['', [Validators.required]],
      acercaDe: ['', [Validators.required, Validators.maxLength(255)]],
      urlImagen: ['', [Validators.required, this.urlValidator.imageUrlValidator()]],
      urlImagenBanner: ['', [Validators.required, this.urlValidator.imageUrlValidator()]]
    });
    this.authStateService.isAdmin$.pipe(takeUntil(this.destroy$)).subscribe(
      isAdmin => this.isAdmin = isAdmin
    );
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  ngOnInit() {
    this.reloadData();
  }

  private reloadData() {
    this.personaService.lista().subscribe(
      (data) => {
        this.personas = data;
      }
    );
  }

  private borrarForm() {
    this.acercaDeForm.reset();
    this.acercaDeForm.patchValue({
      id: '',
      nombre: '',
      apellido: '',
      profesion: '',
      acercaDe: '',
      urlImagen: '',
      urlImagenBanner: ''
    });
  }

  private cargarPersona(personas: Persona) {
    this.acercaDeForm.patchValue({
      id: personas.id,
      nombre: personas.nombre,
      apellido: personas.apellido,
      profesion: personas.profesion,
      acercaDe: personas.acercaDe,
      urlImagen: personas.urlImagen,
      urlImagenBanner: personas.urlImagenBanner
    });
  }

  nuevaPersonas(id: number) {
    let personas: Persona = this.acercaDeForm.value;
    if (this.acercaDeForm.get('id')?.value == '') {
      this.personaService.save(personas).subscribe({
        next: (newPersonas: Persona) => {
          this.toastr.success('Datos Agregados', 'FELICITACIONES', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.personas.push(newPersonas);
          this.reloadData();
          this.dialog.closeAll();
        },
        error: (error) => {
          this.toastr.error('Error al guardar', 'ERROR');
        }
      });
    } else {
      this.personaService.actualizar(id, personas).subscribe({
        next: () => {
          this.toastr.success('Datos Actualizados', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.reloadData();
          this.dialog.closeAll();
        },
        error: (error) => {
          this.toastr.error('Error al actualizar', 'ERROR');
        }
      });
    }
  }

  onNewPersona() {
    this.borrarForm();
    this.dialog.open(this.personaDialog, {
      width: '600px',
      disableClose: true,
      autoFocus: true,
      panelClass: ['mat-typography']
    });
  }

  editarPersona(index: number) {
    let personas: Persona = this.personas[index];
    this.cargarPersona(personas);
    this.dialog.open(this.personaDialog, {
      width: '600px'
    });
  }

  public eliminarPersona(index: number) {
    let personas: Persona = this.personas[index];
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Desea eliminar la persona seleccionada?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.personaService.eliminar(personas.id).subscribe({
          next: () => {
            this.toastr.error('Persona Eliminada', 'ATENCIÓN!', {
              timeOut: 3000, positionClass: 'toast-top-center'
            });
            this.reloadData();
          },
          error: (error) => {
            this.toastr.error('Error al eliminar', 'ERROR');
          }
        });
      }
    });
  }
}