import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BrowserTransferStateModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrService } from 'ngx-toastr';
import { Persona } from 'src/app/models/persona';
import { PersonaService } from 'src/app/servicios/persona.service';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-persona',
  templateUrl: './persona.component.html',
  styleUrls: ['./persona.component.css']
})
export class PersonaComponent implements OnInit {

  public personas: Persona[] = [];
  acercaDeForm: FormGroup;
  roles: string[] = [];
  isAdmin: boolean = false;

  constructor(
    private personaService: PersonaService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private tokenService: TokenService
    ) {
      this.acercaDeForm = this.formBuilder.group({
        id:[''],
        nombre:['', Validators.required],
        apellido:['', Validators.required],
        profesion:['', Validators.required],
        acercaDe:['', Validators.required],
        urlImagen:[''],
        urlImagenBanner:['']
      })
     }

  ngOnInit(){
    this.reloadData();
    
    this.roles = this.tokenService.getAuthorities();
    this.roles.forEach( role => {
      if(role === 'ROLE_ADMIN') {
        this.isAdmin = true;
      }
    })
    
  }

  private reloadData(){
    this.personaService.lista().subscribe(
      (data) => {
        this.personas = data;
      }
    )
  }
  private borrarForm() {
    this.acercaDeForm.setValue({
      id: '',
      nombre:'',
      apellido:'',
      profesion:'',
      acercaDe:'',
      urlImagen:'',
      urlImagenBanner:''
    });
  }
  private cargarPersona(personas: Persona) {
    this.acercaDeForm.setValue({
      id: personas.id,
      nombre: personas.nombre,
      apellido: personas.apellido,
      profesion: personas.profesion,
      acercaDe: personas.acercaDe,
      urlImagen: personas.urlImagen,
      urlImagenBanner: personas.urlImagenBanner
      
    });
  }
  nuevaPersonas(id: number){
    let personas: Persona = this.acercaDeForm.value;
    if(this.acercaDeForm.get('id')?.value == ''){
      this.personaService.save(personas).subscribe(
        (newPersonas: Persona) =>{
          this.toastr.success('Datos Agregados', 'FELICITACIONES', {
            timeOut: 3000, positionClass: 'toast-top-center'});
          this.personas.push(newPersonas);
          this.reloadData();
        }
      );
    }else{
      this.personaService.actualizar(id, personas).subscribe(
        ()=>{
          this.toastr.success('Datos Actualizados', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.reloadData();
        }
      )
    }
  }
  public onNewSkill(){
    this.borrarForm();
  }
  public editarPersona(index: number){
    let personas: Persona = this.personas[index];
    this.cargarPersona(personas);
  }
  public eliminarPersona(index: number){
    let personas: Persona = this.personas[index];
     if(confirm("¿Desea eliminar la persona selecionada?")){
      this.personaService.eliminar(personas.id).subscribe(
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
