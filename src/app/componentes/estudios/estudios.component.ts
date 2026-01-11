import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Estudios } from 'src/app/models/estudios';
import { EstudiosService } from 'src/app/servicios/estudios.service';
import { AuthStateService } from 'src/app/shared/auth-state.service';

@Component({
    selector: 'app-estudios',
    templateUrl: './estudios.component.html',
    styleUrls: ['./estudios.component.css'],
    standalone: false
})
export class EstudiosComponent implements OnInit {
  @ViewChild('estudioDialog') estudioDialog!: TemplateRef<any>;
  public estudio: Estudios[] = [];
  estudioForm: FormGroup;
  isAdmin: boolean = false;
  private dialogRef: MatDialogRef<any> | null = null;

  constructor(
    private estudiosService: EstudiosService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authStateService: AuthStateService,
    private dialog: MatDialog
  ) {
    this.estudioForm = this.formBuilder.group({
      id: [''],
      tituloEstudios: ['', [Validators.required]],
      institucionEstudio: ['', [Validators.required]],
      fechaInicio: ['', [Validators.required]],
      fechaFin: [''],
      urlLogo: [''],
      descripcion: ['', [Validators.required, Validators.maxLength(255)]]
    });

    this.authStateService.isAdmin$.subscribe(
      isAdmin => this.isAdmin = isAdmin
    );
  }

  ngOnInit() {
    this.reloadData();
  }

  private reloadData() {
    this.estudiosService.lista().subscribe(
      (data) => {
        this.estudio = data;
      }
    );
  }

  onNewEstudio() {
    this.borrarForm();
    this.openEstudioDialog();
  }

  editarEstudio(index: number) {
    let estudio: Estudios = this.estudio[index];
    this.cargarEstudio(estudio);
    this.openEstudioDialog();
  }

  private openEstudioDialog() {
    if (this.dialogRef) return;

    this.dialogRef = this.dialog.open(this.estudioDialog, {
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
    this.estudioForm.reset();
    this.estudioForm.patchValue({
      id: '',
      tituloEstudios: '',
      institucionEstudio: '',
      fechaInicio: '',
      fechaFin: '',
      urlLogo: '',
      descripcion: ''
    });
  }

  private cargarEstudio(estudio: Estudios) {
    this.estudioForm.patchValue({
      id: estudio.id,
      tituloEstudios: estudio.tituloEstudios,
      institucionEstudio: estudio.institucionEstudio,
      fechaInicio: estudio.fechaInicio,
      fechaFin: estudio.fechaFin,
      urlLogo: estudio.urlLogo,
      descripcion: estudio.descripcion
    });
  }

  nuevoEstudio(id: number) {
    if (this.estudioForm.invalid) return;

    let estudio: Estudios = this.estudioForm.value;

    if (this.estudioForm.get('id')?.value === '') {
      this.estudiosService.save(estudio).subscribe({
        next: (newEstudio: Estudios) => {
          this.toastr.success('Estudio Agregado', 'ÉXITO', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.estudio.push(newEstudio);
          this.reloadData();
          this.dialogRef?.close();
        },
        error: (error) => {
          this.toastr.error('Error al guardar el estudio', 'ERROR');
        }
      });
    } else {
      this.estudiosService.actualizar(id, estudio).subscribe({
        next: () => {
          this.toastr.success('Estudio Actualizado', 'ÉXITO', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.reloadData();
          this.dialogRef?.close();
        },
        error: (error) => {
          this.toastr.error('Error al actualizar el estudio', 'ERROR');
        }
      });
    }
  }

  eliminarEstudio(index: number) {
    let estudio: Estudios = this.estudio[index];
    if (confirm('¿Desea eliminar el estudio seleccionado?')) {
      this.estudiosService.eliminar(estudio.id).subscribe({
        next: () => {
          this.toastr.warning('Estudio Eliminado', 'OK', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.reloadData();
        },
        error: (error) => {
          this.toastr.error('Error al eliminar el estudio', 'ERROR');
        }
      });
    }
  }
}