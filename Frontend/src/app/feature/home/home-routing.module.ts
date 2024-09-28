import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home.component';

const routes: Routes = [
  {
    path: '', component: HomeComponent,
    children: [
      { path: 'dashboard', loadChildren: () => import('../../feature/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'consultancies', loadChildren: () => import('../../feature/consultancies/consultancies.module').then(m => m.ConsultanciesModule) },
      { path: 'chats', loadChildren: () => import('../../feature/chats/chats.module').then(m => m.ChatsModule) },
      { path: 'diary', loadChildren: () => import('../../feature/diary/diary.module').then(m => m.DiaryModule) },
      { path: 'profile', loadChildren: () => import('../../feature/profile/profile.module').then(m => m.ProfileModule) },
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HomeRoutingModule { }
