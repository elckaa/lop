import { Routes } from '@angular/router';

// Componentes Públicos
import { LandingPageComponent } from './components/landing-page/landing-page';
import { RoleSelectionComponent } from './modules/auth/role-selection/role-selection';
import { LoginComponent } from './modules/auth/login/login';

// Admin
import { DashboardComponent as AdminDashboard } from './modules/admin/dashboard/dashboard';
import { UsersComponent } from './modules/admin/users/users';

// Docente
import { DashboardComponent as TeacherDashboard } from './modules/teacher/dashboard/dashboard';
import { CreateRoundComponent } from './modules/teacher/create-round/create-round';

// Estudiante (IMPORTACIONES NUEVAS)
import { DashboardComponent as StudentDashboard } from './modules/student/dashboard/dashboard';
import { PracticeComponent } from './modules/student/practice/practice';

// Guards
import { authGuard } from './guards/auth-guard';
import { roleGuard } from './guards/role-guard';

export const routes: Routes = [

  // =========================
  // RUTAS PÚBLICAS
  // =========================
  { path: '', component: LandingPageComponent },
  { path: 'roles', component: RoleSelectionComponent },
  { path: 'login', component: LoginComponent },

  // =========================
  // ADMIN
  // =========================
  {
    path: 'admin',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ADMIN'] },
    children: [
      { path: 'dashboard', component: AdminDashboard },
      { path: 'users', component: UsersComponent }
    ]
  },

  // =========================
  // DOCENTE
  // =========================
  {
    path: 'teacher',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['DOCENTE'] },
    children: [
      { path: 'dashboard', component: TeacherDashboard },
      { path: 'create-round', component: CreateRoundComponent },
      { path: 'edit-round/:id', component: CreateRoundComponent } // Ruta de edición
    ]
  },

  // =========================
  // ESTUDIANTE
  // =========================
  {
    path: 'student',
    canActivate: [authGuard, roleGuard],
    data: { roles: ['ESTUDIANTE'] },
    children: [
      { path: 'dashboard', component: StudentDashboard },
      // Esta ruta 'practice/:id' es vital para que el botón "Jugar" funcione
      { path: 'practice/:id', component: PracticeComponent }
    ]
  },

  // =========================
  // FALLBACK
  // =========================
  { path: '**', redirectTo: '' }
];
