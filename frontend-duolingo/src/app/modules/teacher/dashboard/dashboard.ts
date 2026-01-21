import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // <--- NUEVO: Importante para el input
import { TeacherService, Ronda, ReporteProgreso } from '../../../services/teacher';
import { AuthService } from '../../../services/auth';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-teacher-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule], // <--- NUEVO: Agregamos FormsModule
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css']
})
export class DashboardComponent implements OnInit {

  rondas: Ronda[] = [];
  reportes: ReporteProgreso[] = [];
  vistaActual: 'dashboard' | 'reportes' = 'dashboard';

  // --- NUEVO: Variable para el buscador ---
  filtroBusqueda: string = '';

  username = 'Docente';
  cargando = true;
  error = false;

  constructor(
    private teacherService: TeacherService,
    private authService: AuthService,
    private router: Router,
    private cd: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (!user) {
      this.router.navigate(['/login']);
      return;
    }
    this.username = user.username;
    this.cargarDatos();
  }

  // --- NUEVO: Getter Mágico que filtra la lista ---
  // Cada vez que escribas en el input, esta función se ejecuta sola
  get reportesFiltrados() {
    // Si no hay texto, devolvemos todo
    if (!this.filtroBusqueda) {
      return this.reportes;
    }
    // Si hay texto, filtramos por nombre de estudiante (ignorando mayúsculas/minúsculas)
    const texto = this.filtroBusqueda.toLowerCase();
    return this.reportes.filter(rep =>
      rep.estudiante.username.toLowerCase().includes(texto)
    );
  }

  // ... (El resto de tus métodos: cargarDatos, verReportes, toggleStatus, etc. Siguen IGUAL) ...

  cargarDatos() {
    this.cargando = true;
    this.vistaActual = 'dashboard';

    this.teacherService.getRondas().subscribe({
      next: (data: any) => {
        this.rondas = Array.isArray(data) ? data : (data?.content || []);
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.error = true;
        this.cargando = false;
        this.cd.detectChanges();
        Swal.fire('Error', 'No se pudo conectar con el servidor', 'error');
      }
    });
  }

  verReportes() {
    this.cargando = true;
    this.vistaActual = 'reportes';

    this.teacherService.obtenerReporteGlobal().subscribe({
      next: (data) => {
        this.reportes = data || [];
        this.cargando = false;
        this.cd.detectChanges();
      },
      error: (err) => {
        this.cargando = false;
        this.vistaActual = 'dashboard';
        this.cd.detectChanges();
        Swal.fire('Error', 'No se pudieron cargar las notas.', 'error');
      }
    });
  }

  toggleStatus(ronda: Ronda): void {
    const estadoOriginal = ronda.activo;
    ronda.activo = !ronda.activo;

    this.teacherService.toggleRonda(ronda.id).subscribe({
      next: () => {
        this.cd.detectChanges();
        Swal.fire({
            icon: 'success',
            title: `Ronda ${ronda.activo ? 'Activada' : 'Desactivada'}`,
            toast: true,
            position: 'top-end',
            showConfirmButton: false,
            timer: 1500
        });
      },
      error: () => {
        ronda.activo = estadoOriginal;
        this.cd.detectChanges();
        Swal.fire('Error', 'No se pudo guardar el cambio', 'error');
      }
    });
  }

  deleteRound(id: number): void {
    Swal.fire({
      title: '¿Estás seguro?',
      text: "Esta acción no se puede deshacer",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.teacherService.eliminarRonda(id).subscribe({
          next: () => {
            this.rondas = this.rondas.filter(r => r.id !== id);
            this.cd.detectChanges();
            Swal.fire('Eliminado', 'La ronda ha sido eliminada', 'success');
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
