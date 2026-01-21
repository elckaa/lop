import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { TeacherService, Ronda } from '../../../services/teacher';
import { AuthService } from '../../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  rondas: Ronda[] = [];
  username = 'Docente';
  cargando = true;
  error = false;

  constructor(
    private teacherService: TeacherService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.username = user.username;

    // Suscribirse al BehaviorSubject de rondas
    this.teacherService.rondas$.subscribe(data => {
      this.rondas = data;
      this.cargando = false;
    });

    // Cargar rondas desde backend
    this.teacherService.cargarRondas();
  }

  toggleStatus(ronda: Ronda): void {
    this.teacherService.toggleRonda(ronda.id).subscribe({
      next: () => {
        ronda.activo = !ronda.activo;
        Swal.fire({
          icon: 'success',
          title: `Ronda ${ronda.activo ? 'activada' : 'desactivada'}`,
          timer: 1000,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        });
      },
      error: () => Swal.fire('Error', 'No se pudo cambiar el estado', 'error')
    });
  }

  deleteRound(id: number): void {
    Swal.fire({
      title: '¿Eliminar ronda?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then(result => {
      if (result.isConfirmed) {
        this.teacherService.eliminarRonda(id).subscribe({
          next: () => {
            const filtradas = this.rondas.filter(r => r.id !== id);
            this.teacherService.actualizarLocal(filtradas); // actualizar BehaviorSubject
            Swal.fire('Eliminada', 'Ronda eliminada', 'success');
          },
          error: () => Swal.fire('Error', 'No se pudo eliminar', 'error')
        });
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
