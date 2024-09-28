import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './core/services/auth.guard';

const routes: Routes = [
  { path: 'auth', loadChildren: () => import('./feature/auth/auth.module').then(m => m.AuthModule) },
  {
    path: '',
    canMatch: [authGuard],
    children: [
      { path: '', loadChildren: () => import('./feature/home/home.module').then(m => m.HomeModule) },
    ]
  },
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
