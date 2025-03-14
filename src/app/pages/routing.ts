import { Routes } from '@angular/router';
import { AuthGuard } from '../modules/auth/services/auth.guard';
import { DashboardNewComponent } from './dashboard-new/dashboard-new.component';



export const Routing: Routes = [
  {
    path: 'dadtwo-dashboard',
    loadChildren: () =>
      import('./dadtwo-dashboard/dadtwo-dashboard.module').then(
        (m) => m.DadtwoDashboardModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'dashboard-new',
    component:DashboardNewComponent,
    canActivate:[AuthGuard]
  },
  {
    path: 'meeting-dashboard',
    loadChildren: () =>
      import('../app/modules/widgets-examples/meeting-dashboard/meeting-dashboard.module').then((m) => m.MeetingDashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'com-dashboard',
    loadChildren: () =>
      import('../app/modules/widgets-examples/com-dashboard/com-dashboard.module').then((m) => m.ComDashboardModule),
    canActivate: [AuthGuard],
  },
  {
    path: 'builder',
    loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/account',
    loadChildren: () => import('../modules/account/account.module').then((m) => m.AccountModule),
    // data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () => import('../modules/widgets-examples/widgets-examples.module').then((m) => m.WidgetsExamplesModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () => import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'apps/permissions',
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
  },
  {
    path: 'fir-edit-module',
    loadChildren: () => import('../modules/widgets-examples/edit//edit-fir.module').then((m) => m.EditFirModule),
  },
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];


