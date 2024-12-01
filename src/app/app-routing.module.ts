import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonaComponent } from './componentes/persona/persona.component';

const routes: Routes = [
  {path: '', component: PersonaComponent},
  {path: 'detalle\:id', component: PersonaComponent, data: {expectedRol: ['admin', 'user']} },
  {path: 'crear', component: PersonaComponent, data: {expectedRol: ['admin']}},
  {path: 'actualizar\:id', component: PersonaComponent, data: {expectedRol: ['admin']}},
  {path: 'eliminar\:id', component: PersonaComponent, data: {expectedRol: ['admin']}},
  {path: '**', redirectTo: '', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
