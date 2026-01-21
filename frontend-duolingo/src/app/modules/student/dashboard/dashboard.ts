import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { StudentService, Ronda, Progress } from '../../../services/student';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-student-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  rondas: Ronda[] = [];
  historial: Progress[] = [];
  username = 'Estudiante';
  userId: number = 0;
  cargando = true;

  constructor(
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.username = user.username;
      this.userId = user.id;
    }
    this.cargarDatos();
  }

  cargarDatos() {
    this.cargando = true;

    this.studentService.getRondas().subscribe({
      next: (data: any) => {
        console.log('Rondas raw:', data);
        const todas = Array.isArray(data) ? data : [];

        // --- ARREGLO DEL FILTRO ---
        // Usamos '==' en lugar de '===' para que acepte: true, 1, "true"
        // Esto soluciona que algunas rondas activas no se vieran.
        this.rondas = todas.filter((r: Ronda) => r.activo == true);

        // Cargar historial después de cargar rondas
        this.cargarHistorial();
      },
      error: (err) => {
        console.error('Error cargando rondas:', err);
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  cargarHistorial() {
    this.studentService.getHistorial(this.userId).subscribe({
      next: (hist: any) => {
        console.log('Historial:', hist);
        this.historial = Array.isArray(hist) ? hist : [];

        // Fin de carga total
        this.cargando = false;
        this.cd.detectChanges(); // Forzamos actualización para quitar spinner
      },
      error: () => {
        this.cargando = false;
        this.cd.detectChanges();
      }
    });
  }

  getPuntajeRonda(rondaId: number): number | null {
    if (!this.historial) return null;
    const progreso = this.historial.find((h: any) => h.ronda && h.ronda.id === rondaId);
    return progreso ? progreso.puntaje : null;
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
