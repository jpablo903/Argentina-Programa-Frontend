import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BarNavComponent } from './componentes/bar-nav/bar-nav.component';
import { PersonaComponent } from './componentes/persona/persona.component';
import { EstudiosComponent } from './componentes/estudios/estudios.component';
import { ExperienciaComponent } from './componentes/experiencia/experiencia.component';
import { ProyectosComponent } from './componentes/proyectos/proyectos.component';
import { SkillComponent } from './componentes/skill/skill.component';
import { HttpClientModule} from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { InterceptProvider } from './interceptors/interceptor.service';


@NgModule({
  declarations: [
    AppComponent,
    BarNavComponent,
    PersonaComponent,
    EstudiosComponent,
    ExperienciaComponent,
    ProyectosComponent,
    SkillComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ReactiveFormsModule,
    NgCircleProgressModule.forRoot({}),
    BrowserAnimationsModule,
    ToastrModule.forRoot(),
    HttpClientModule,
    FormsModule,
    RouterModule
  ],
  providers: [InterceptProvider],
  bootstrap: [AppComponent]
})
export class AppModule { }
