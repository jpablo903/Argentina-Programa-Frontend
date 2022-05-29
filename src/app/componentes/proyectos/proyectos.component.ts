import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Proyecto } from 'src/app/models/proyecto';
import { ProyectoService } from 'src/app/servicios/proyecto.service';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-proyectos',
  templateUrl: './proyectos.component.html',
  styleUrls: ['./proyectos.component.css']
})
export class ProyectosComponent implements OnInit {

  public proyectos: Proyecto[] = [];
  proyectoForm: FormGroup;
  message:'' = "";
  roles: string[] = [];
  isAdmin: boolean = false;
  isLogged = false;

  constructor(
    private proyectoService: ProyectoService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private tokenService: TokenService
    ) {
      this.proyectoForm = this.formBuilder.group({
        id:[''],
        nombreProyecto:['', [Validators.required, Validators.minLength(4)]],
        descripcion:['', [Validators.required, Validators.minLength(50), Validators.maxLength(255)]],
        urlImagen:['', [Validators.required]],
        urlProyecto:['', [Validators.required]]
      })
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

  public reloadData(){
    this.proyectoService.lista().subscribe(
      (data)=>{
        this.proyectos = data;
      }
    )
  }

  private borrarForm() {
    this.proyectoForm.setValue({
      id: '',
      nombreProyecto:'',
      descripcion:'',
      urlImagen:'',
      urlProyecto:''
    });
  }

  private cargarProyecto(proyectos: Proyecto) {
    this.proyectoForm.setValue({
      id: proyectos.id,
      nombreProyecto: proyectos.nombreProyecto,
      descripcion: proyectos.descripcion,
      urlImagen: proyectos.urlImagen,
      urlProyecto: proyectos.urlProyecto 
      
    });
  }

  nuevoProyecto(id: number){
    let proyectos: Proyecto = this.proyectoForm.value;
    if(this.proyectoForm.get('id')?.value == ''){
      this.proyectoService.save(proyectos).subscribe(
        (newProyecto: Proyecto) =>{
          this.toastr.success('Proyecto Agregado', 'FELICITACIONES', {
            timeOut: 3000, positionClass: 'toast-top-center'});
          this.proyectos.push(newProyecto);
          this.reloadData();
        }
      );
    }else{
      this.proyectoService.actualizar(id, proyectos).subscribe(
        ()=>{
          this.toastr.success('Proyecto Actualizado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.reloadData();
        }
      )
    }
  }
  public onNewProyecto(){
    this.borrarForm();
  }
  public editarProyecto(index: number){
    let proyectos: Proyecto = this.proyectos[index];
    this.cargarProyecto(proyectos);
  }
  public eliminarProyecto(index: number){
    let proyectos: Proyecto = this.proyectos[index];
     if(confirm("¿Desea eliminar el Proyecto selecionado?")){
      this.proyectoService.eliminar(proyectos.id).subscribe(
        ()=> {
          this.toastr.error('Proyecto Eliminado', 'ATENCION!', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.reloadData();
        }
      )
    }
  }


}
