import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Skill } from 'src/app/models/skill';
import { SkillService } from 'src/app/servicios/skill.service';
import { TokenService } from 'src/app/servicios/token.service';

@Component({
  selector: 'app-skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

  public skills: Skill[] = []; 
  skillForm: FormGroup;
  message: '' = "";
  roles: string[] = [];
  isAdmin: boolean = false;
  isLogged = false;

  constructor(
    private skillService: SkillService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService,
    private tokenService: TokenService
    ) {
      this.skillForm = this.formBuilder.group({
        id:[''],
        nombre:['', Validators.required],
        porcentaje:['', Validators.required],
        urlImagen:['']
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

  private reloadData(){
    this.skillService.lista().subscribe(
      (data) => {
        this.skills = data;
      }
    )
  }
  private borrarForm() {
    this.skillForm.setValue({
      id: '',
      nombre:'',
      porcentaje:'',
      urlImagen:''
    });
  }
  private cargarSkill(skills: Skill) {
    this.skillForm.setValue({
      id: skills.id,
      nombre: skills.nombre,
      porcentaje: skills.porcentaje,
      urlImagen: skills.urlImagen
      
    });
  }
  nuevoSkill(id: number){
    let skills: Skill = this.skillForm.value;
    if(this.skillForm.get('id')?.value == ''){
      this.skillService.save(skills).subscribe(
        (newSkill: Skill) =>{
          this.toastr.success('Skill Agregado', 'FELICITACIONES', {
            timeOut: 3000, positionClass: 'toast-top-center'});
          this.skills.push(newSkill);
          this.reloadData();
        }
      );
    }else{
      this.skillService.actualizar(id, skills).subscribe(
        ()=>{
          this.toastr.success('Skill Actualizado', 'OK', {
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
  public editarSkill(index: number){
    let skills: Skill = this.skills[index];
    this.cargarSkill(skills);
  }
  public eliminarSkill(index: number){
    let skills: Skill = this.skills[index];
     if(confirm("¿Desea eliminar el Skill selecionado?")){
      this.skillService.eliminar(skills.id).subscribe(
        ()=> {
          this.toastr.error('Skill Eliminado', 'ATENCION!', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.reloadData();
        }
      )
    }
  }
}