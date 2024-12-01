import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Skill } from 'src/app/models/skill';
import { SkillService } from 'src/app/servicios/skill.service';
import { AuthStateService } from 'src/app/shared/auth-state.service';
import SwiperCore, { Navigation, Pagination, SwiperOptions } from 'swiper';

SwiperCore.use([Navigation, Pagination]);

@Component({
  selector: 'app-skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  @ViewChild('skillDialog') skillDialog!: TemplateRef<any>;
  public skills: Skill[] = [];
  skillForm: FormGroup;
  isAdmin: boolean = false;
  private dialogRef: MatDialogRef<any> | null = null;

  swiperConfig: SwiperOptions = {
    slidesPerView: 3,
    spaceBetween: 30,
    navigation: true,
    pagination: { clickable: true },
    breakpoints: {
      0: {
        slidesPerView: 1,
        spaceBetween: 20
      },
      768: {
        slidesPerView: 2,
        spaceBetween: 30
      },
      1024: {
        slidesPerView: 3,
        spaceBetween: 30
      }
    }
  };

  constructor(
    private skillService: SkillService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private authStateService: AuthStateService,
    private dialog: MatDialog
  ) {
    this.skillForm = this.formBuilder.group({
      id: [''],
      nombre: ['', [Validators.required]],
      porcentaje: ['', [Validators.required, Validators.min(0), Validators.max(100)]]
    });

    this.authStateService.isAdmin$.subscribe(
      isAdmin => this.isAdmin = isAdmin
    );
  }

  ngOnInit() {
    this.reloadData();
  }

  private reloadData() {
    this.skillService.lista().subscribe(
      (data) => {
        this.skills = data;
      }
    );
  }

  onNewSkill() {
    this.borrarForm();
    this.openSkillDialog();
  }

  editarSkill(index: number) {
    let skill: Skill = this.skills[index];
    this.cargarSkill(skill);
    this.openSkillDialog();
  }

  private openSkillDialog() {
    if (this.dialogRef) return;

    this.dialogRef = this.dialog.open(this.skillDialog, {
      width: '400px',
      disableClose: true,
      autoFocus: true,
      panelClass: ['mat-typography']
    });

    this.dialogRef.afterClosed().subscribe(() => {
      this.dialogRef = null;
    });
  }

  private borrarForm() {
    this.skillForm.reset();
    this.skillForm.patchValue({
      id: '',
      nombre: '',
      porcentaje: ''
    });
  }

  private cargarSkill(skill: Skill) {
    this.skillForm.patchValue({
      id: skill.id,
      nombre: skill.nombre,
      porcentaje: skill.porcentaje
    });
  }

  nuevaSkill(id: number) {
    if (this.skillForm.invalid) return;

    let skill: Skill = this.skillForm.value;
    
    if (this.skillForm.get('id')?.value === '') {
      this.skillService.save(skill).subscribe({
        next: (newSkill: Skill) => {
          this.toastr.success('Skill Agregada', 'ÉXITO', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.skills.push(newSkill);
          this.reloadData();
          this.dialogRef?.close();
        },
        error: (error) => {
          this.toastr.error('Error al guardar la skill', 'ERROR');
        }
      });
    } else {
      this.skillService.actualizar(id, skill).subscribe({
        next: () => {
          this.toastr.success('Skill Actualizada', 'ÉXITO', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.reloadData();
          this.dialogRef?.close();
        },
        error: (error) => {
          this.toastr.error('Error al actualizar la skill', 'ERROR');
        }
      });
    }
  }

  eliminarSkill(index: number) {
    let skill: Skill = this.skills[index];
    if (confirm('¿Desea eliminar la skill seleccionada?')) {
      this.skillService.eliminar(skill.id).subscribe({
        next: () => {
          this.toastr.warning('Skill Eliminada', 'OK', {
            timeOut: 3000,
            positionClass: 'toast-top-center'
          });
          this.reloadData();
        },
        error: (error) => {
          this.toastr.error('Error al eliminar la skill', 'ERROR');
        }
      });
    }
  }
}