import { Component, OnInit, ViewChild, TemplateRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Proyecto } from 'src/app/models/proyecto';
import { ProyectoService } from 'src/app/servicios/proyecto.service';
import { AuthStateService } from 'src/app/shared/auth-state.service';
import { UrlValidatorService } from 'src/app/shared/url-validator.service';
import { ConfirmDialogComponent } from 'src/app/shared/confirm-dialog.component';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
    selector: 'app-proyectos',
    templateUrl: './proyectos.component.html',
    styleUrls: ['./proyectos.component.css'],
    standalone: false,
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProyectosComponent implements OnInit, OnDestroy {
  @ViewChild('proyectoDialog') proyectoDialog!: TemplateRef<any>;
  public proyectos: Proyecto[] = [];
  proyectoForm: FormGroup;
  isAdmin: boolean = false;
  private dialogRef: MatDialogRef<any> | null = null;
  private destroy$ = new Subject<void>();

  constructor(
    private proyectoService: ProyectoService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authStateService: AuthStateService,
    private dialog: MatDialog,
    private urlValidator: UrlValidatorService
  ) {
    this.proyectoForm = this.formBuilder.group({
      id: [''],
      nombreProyecto: ['', [Validators.required]],
      descripcion: ['', [Validators.required]],
      urlProyecto: ['', [Validators.required]],
      urlImagen: ['', [Validators.required, this.urlValidator.imageUrlValidator()]]
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
    this.proyectoService.lista().subscribe(
      (data) => {
        this.proyectos = data;
      }
    );
  }

  onNewProyecto() {
    this.borrarForm();
    this.openProyectoDialog();
  }

  editarProyecto(index: number) {
    let proyecto: Proyecto = this.proyectos[index];
    this.cargarProyecto(proyecto);
    this.openProyectoDialog();
  }

  private openProyectoDialog() {
    if (this.dialogRef) return;

    this.dialogRef = this.dialog.open(this.proyectoDialog, {
      width: '500px',
      disableClose: true,
      autoFocus: true,
      panelClass: ['mat-typography']
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }

  private borrarForm() {
    this.proyectoForm.reset();
    this.proyectoForm.patchValue({
      id: '',
      nombreProyecto: '',
      descripcion: '',
      urlProyecto: '',
      urlImagen: ''
    });
  }

  private cargarProyecto(proyecto: Proyecto) {
    this.proyectoForm.patchValue({
      id: proyecto.id,
      nombreProyecto: proyecto.nombreProyecto,
      descripcion: proyecto.descripcion,
      urlProyecto: proyecto.urlProyecto,
      urlImagen: proyecto.urlImagen
    });
  }

  nuevoProyecto(id: number) {
    if (this.proyectoForm.invalid) return;

    let proyecto: Proyecto = this.proyectoForm.value;

    if (this.proyectoForm.get('id')?.value === '') {
      this.proyectoService.save(proyecto).subscribe({
        next: (newProyecto: Proyecto) => {
          this.toastr.success('Proyecto Agregado', 'ÉXITO', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.proyectos.push(newProyecto);
          this.reloadData();
          this.dialogRef?.close();
        },
        error: (error) => {
          this.toastr.error('Error al guardar el proyecto', 'ERROR');
        }
      });
    } else {
      this.proyectoService.actualizar(id, proyecto).subscribe({
        next: () => {
          this.toastr.success('Proyecto Actualizado', 'ÉXITO', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.reloadData();
          this.dialogRef?.close();
        },
        error: (error) => {
          this.toastr.error('Error al actualizar el proyecto', 'ERROR');
        }
      });
    }
  }

  eliminarProyecto(index: number) {
    let proyecto: Proyecto = this.proyectos[index];
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        title: 'Confirmar Eliminación',
        message: '¿Desea eliminar el proyecto seleccionado?',
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.proyectoService.eliminar(proyecto.id).subscribe({
          next: () => {
            this.toastr.warning('Proyecto Eliminado', 'OK', {
              timeOut: 3000,
              positionClass: 'toast-top-center'
            });
            this.reloadData();
          },
          error: (error) => {
            this.toastr.error('Error al eliminar el proyecto', 'ERROR');
          }
        });
      }
    });
  }
}