import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Experiencia } from 'src/app/models/experiencia';
import { ExperienciaService } from 'src/app/servicios/experiencia.service';
import { AuthStateService } from 'src/app/shared/auth-state.service';

@Component({
    selector: 'app-experiencia',
    templateUrl: './experiencia.component.html',
    styleUrls: ['./experiencia.component.css'],
    standalone: false
})
export class ExperienciaComponent implements OnInit {
  @ViewChild('experienciaDialog') experienciaDialog!: TemplateRef<any>;
  public experiencia: Experiencia[] = [];
  experienciaForm: FormGroup;
  isAdmin: boolean = false;
  private dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private experienciaService: ExperienciaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authStateService: AuthStateService,
    private dialog: MatDialog
  ) {
    this.experienciaForm = this.formBuilder.group({
      id: [''],
      puesto: ['', [Validators.required]],
      nombreCompania: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: [''],
      descripcion: ['', [Validators.required]]
    });

    this.authStateService.isAdmin$.subscribe(
      isAdmin => this.isAdmin = isAdmin
    );
  }

  ngOnInit() {
    this.reloadData();
  }

  private reloadData() {
    this.experienciaService.lista().subscribe(
      (data) => {
        this.experiencia = data;
      }
    );
  }

  onNewExperiencia() {
    this.borrarForm();
    this.openExperienciaDialog();
  }

  editarExperiencia(index: number) {
    let experiencia: Experiencia = this.experiencia[index];
    this.cargarExperiencia(experiencia);
    this.openExperienciaDialog();
  }

  private openExperienciaDialog() {
    if (this.dialogRef) return;

    this.dialogRef = this.dialog.open(this.experienciaDialog, {
      width: '600px',
      disableClose: true,
      autoFocus: true,
      panelClass: ['mat-typography']
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }

  private borrarForm() {
    this.experienciaForm.reset();
    this.experienciaForm.patchValue({
      id: '',
      puesto: '',
      nombreCompania: '',
      fechaInicio: '',
      fechaFin: '',
      descripcion: ''
    });
  }

  private cargarExperiencia(experiencia: Experiencia) {
    this.experienciaForm.patchValue({
      id: experiencia.id,
      puesto: experiencia.puesto,
      nombreCompania: experiencia.nombreCompania,
      fechaInicio: experiencia.fechaInicio,
      fechaFin: experiencia.fechaFin,
      descripcion: experiencia.descripcion
    });
  }

  nuevaExperiencia(id: number) {
    if (this.experienciaForm.invalid) return;

    let experiencia: Experiencia = this.experienciaForm.value;

    if (this.experienciaForm.get('id')?.value === '') {
      this.experienciaService.save(experiencia).subscribe({
        next: (newExperiencia: Experiencia) => {
          this.toastr.success('Experiencia Agregada', 'ÉXITO', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.experiencia.push(newExperiencia);
          this.reloadData();
          this.dialogRef?.close();
        },
        error: (error) => {
          this.toastr.error('Error al guardar la experiencia', 'ERROR');
        }
      });
    } else {
      this.experienciaService.actualizar(id, experiencia).subscribe({
        next: () => {
          this.toastr.success('Experiencia Actualizada', 'ÉXITO', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.reloadData();
          this.dialogRef?.close();
        },
        error: (error) => {
          this.toastr.error('Error al actualizar la experiencia', 'ERROR');
        }
      });
    }
  }

  eliminarExperiencia(index: number) {
    let experiencia: Experiencia = this.experiencia[index];
    if (confirm('¿Desea eliminar la experiencia seleccionada?')) {
      this.experienciaService.eliminar(experiencia.id).subscribe({
        next: () => {
          this.toastr.warning('Experiencia Eliminada', 'OK', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.reloadData();
        },
        error: (error) => {
          this.toastr.error('Error al eliminar la experiencia', 'ERROR');
        }
      });
    }
  }
}