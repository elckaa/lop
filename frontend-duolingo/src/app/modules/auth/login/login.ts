import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AuthService, LoginResponse } from '../../../services/auth';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {

  credentials = {
    username: '',
    password: ''
  };

  tituloLogin = 'Ingresar';
  esDocente = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Leer el tipo desde /roles
    this.route.queryParams.subscribe(params => {
      if (params['tipo'] === 'docente') {
        this.esDocente = true;
        this.tituloLogin = 'Ingreso Docente / Admin';
      } else {
        this.esDocente = false;
        this.tituloLogin = 'Ingreso Estudiante';
      }
    });
  }

  onLogin(): void {
    this.authService.login(this.credentials).subscribe({
      next: (data: LoginResponse) => {
        if (!data) {
          Swal.fire('Error', 'Credenciales inválidas', 'error');
          return;
        }

        const role = data.role; // 🔹 Directo según backend

        if (role === 'ADMIN') {
          this.router.navigate(['/admin/dashboard']);
        } else if (role === 'DOCENTE') {
          this.router.navigate(['/teacher/dashboard']);
        } else {
          this.router.navigate(['/student/dashboard']);
        }
      },
      error: (err) => {
        if (err.status === 403) {
          Swal.fire('Error', 'Usuario o contraseña incorrectos', 'error');
        } else {
          Swal.fire('Error', 'Ocurrió un error en el servidor', 'error');
        }
      }
    });
  }
}
