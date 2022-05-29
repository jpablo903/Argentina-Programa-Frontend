import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Experiencia } from 'src/app/models/experiencia';
import { AuthService } from 'src/app/servicios/auth.service';
import { ExperienciaService } from 'src/app/servicios/experiencia.service';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-experiencia',
  templateUrl: './experiencia.component.html',
  styleUrls: ['./experiencia.component.css']
})
export class ExperienciaComponent implements OnInit {

  public experiencia: Experiencia[] = [];
  experienciaForm: FormGroup;
  message: '' = "";
  roles: string[] = [];
  isAdmin: boolean = false;
  isLogged = false

  constructor(
    private experienciaService: ExperienciaService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private tokenService: TokenService
    ) {
      this.experienciaForm = this.formBuilder.group({
        id:[''],
        puesto:['', [Validators.required]],
        nombreCompania:['', [Validators.required]],
        imgUrl:[''],
        lugar:['', [Validators.required]],
        fechaInicio:['', [Validators.required]],
        fechaFin:['', [Validators.required]],
        descripcion:['', [Validators.required, Validators.maxLength(255)]]
      });
     }

  ngOnInit() {
    this.reloadData();

    if(this.tokenService.getToken()){
      this.isLogged = true;
    }else {
      this.isLogged = false;
    }

    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach( role => {
      if(role === 'ROLE_ADMIN') {
        this.isAdmin = true;
        }
      })

  }

  private reloadData(){
    this.experienciaService.lista().subscribe(
      (data) => {
        this.experiencia = data;
      }
    )
  }

  private borrarForm() {
    this.experienciaForm.setValue({
      id: '',
      puesto:'',
      nombreCompania:'',
      imgUrl:'',
      lugar:'',
      fechaInicio:'',
      fechaFin:'',
      descripcion:''
    });
  }
  private cargarExperiencia(experiencia: Experiencia) {
    this.experienciaForm.setValue({
      id: experiencia.id,
      puesto: experiencia.puesto,
      nombreCompania: experiencia.nombreCompania,
      imgUrl: experiencia.imgUrl,
      lugar: experiencia.lugar,
      fechaInicio: experiencia.fechaInicio,
      fechaFin: experiencia.fechaFin,
      descripcion: experiencia.descripcion
      
    });
  }
  nuevoExperiencia(id: number){
    let experiencia: Experiencia = this.experienciaForm.value;
    if(this.experienciaForm.get('id')?.value == ''){
      this.experienciaService.save(experiencia).subscribe(
        (newExperiencia: Experiencia) =>{
          this.toastr.success('Experiencia Agregada', 'FELICITACIONES', {
            timeOut: 3000, positionClass: 'toast-top-center'});
          this.experiencia.push(newExperiencia);
          this.reloadData();
        }
      );
    }else{
      this.experienciaService.actualizar(id, experiencia).subscribe(
        ()=>{
          this.toastr.success('Experiencia Actualizada', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.reloadData();
        }
      )
    }
  }
  public onNewExp(){
    this.borrarForm();
  }

  public editarExperiencia(index: number){
    let experiencia: Experiencia = this.experiencia[index];
    this.cargarExperiencia(experiencia);
  }

  public eliminarExperiencia(index: number){
    let experiencia: Experiencia = this.experiencia[index];
     if(confirm("¿Desea eliminar la experiencia selecionado?")){
      this.experienciaService.eliminar(experiencia.id).subscribe(
        ()=> {
          this.toastr.error('Experiencia Eliminado', 'ATENCION!', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.reloadData();
        }
      )
    }
  }

}
