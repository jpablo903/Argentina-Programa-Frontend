import { Component, OnInit } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Estudios } from 'src/app/models/estudios';
import { EstudiosService } from 'src/app/servicios/estudios.service';
import { ToastrService } from 'ngx-toastr';

import { FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AuthService } from 'src/app/servicios/auth.service';
import { TokenService } from 'src/app/servicios/token.service';


@Component({
  selector: 'app-estudios',
  templateUrl: './estudios.component.html',
  styleUrls: ['./estudios.component.css']
})
export class EstudiosComponent implements OnInit {

  public estudio: Estudios[] = [];
  estudioForm: FormGroup;  
  message: '' = "";
  roles: string[] = [];
  isAdmin: boolean = false;
  isLogged = false

  constructor(
    private estudiosService: EstudiosService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService,
    private tokenService: TokenService
    ) { 
      this.estudioForm = this.formBuilder.group({
        id:[''],
        tituloEstudios:['', Validators.required],
        institucionEstudio:['', Validators.required],
        fechaInicio:['', Validators.required],
        fechaFin:['', Validators.required],
        urlLogo:[''],
        descripcion:['', Validators.required]
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

  private reloadData() {
    this.estudiosService.lista().subscribe(
      (data) => {
        this.estudio = data;
      }
    ); 
  }

  private borrarForm() {
    this.estudioForm.setValue({
      id: '',
      tituloEstudios:'',
      institucionEstudio:'',
      fechaInicio:'',
      fechaFin:'',
      urlLogo:'',
      descripcion:''
    });
  }

  private cargarEstudios(estudio: Estudios) {
    this.estudioForm.setValue({
      id: estudio.id,
      tituloEstudios: estudio.tituloEstudios,
      institucionEstudio: estudio.institucionEstudio,
      fechaInicio: estudio.fechaInicio,
      fechaFin: estudio.fechaFin,
      urlLogo: estudio.urlLogo,
      descripcion: estudio.descripcion
      
    });
  }

 
  nuevoEstudio(id: number){
    let estudio: Estudios = this.estudioForm.value;
    if(this.estudioForm.get('id')?.value == ''){
      this.estudiosService.save(estudio).subscribe(
        (newEstudio: Estudios) =>{
          this.toastr.success('Estudio Agregado', 'FELICITACIONES', {
            timeOut: 3000, positionClass: 'toast-top-center'});
          this.estudio.push(newEstudio);
          this.reloadData();
        }
      );
    }else{
      this.estudiosService.actualizar(id, estudio).subscribe(
        ()=>{
          this.toastr.success('Estudio Actualizado', 'OK', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.reloadData();
        }
      )
    }
  }

  public onNewEstudio(){
    this.borrarForm();
  }

  public editarEstudio(index: number){
    let estudio: Estudios = this.estudio[index];
    this.cargarEstudios(estudio);
  }

  public eliminarEstudio(index: number){
    let estudio: Estudios = this.estudio[index];
     if(confirm("¿Desea eliminar el Estudio selecionado?")){
      this.estudiosService.eliminar(estudio.id).subscribe(
        ()=> {
          this.toastr.error('Estudio Eliminado', 'ATENCION!', {
            timeOut: 3000, positionClass: 'toast-top-center'
          });
          this.reloadData();
        }
      )
    }
  }

}
