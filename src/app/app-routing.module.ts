import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PersonaComponent } from './componentes/persona/persona.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  {path: '', component: PersonaComponent},
  {path: 'detalle\:id', component: PersonaComponent, data: {expectedRol: ['admin', 'user']}, canActivate: [AuthGuard]},
  {path: 'crear', component: PersonaComponent, data: {expectedRol: ['admin']}, canActivate: [AuthGuard]},
  {path: 'actualizar\:id', component: PersonaComponent, data: {expectedRol: ['admin']}, canActivate: [AuthGuard]},
  {path: 'eliminar\:id', component: PersonaComponent, data: {expectedRol: ['admin']}, canActivate: [AuthGuard]},
  {path: '**', redirectTo: '', pathMatch:'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    enableTracing: false,
    onSameUrlNavigation: 'reload'
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
