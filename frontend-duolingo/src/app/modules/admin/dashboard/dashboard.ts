import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router'; // Importamos RouterLink
import Swal from 'sweetalert2';
import { AuthService } from '../../../services/auth';
import { AdminService } from '../../../services/admin'; // Importamos AdminService

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink], // Importamos RouterLink para que el HTML lo use
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardComponent implements OnInit {

  username: string = 'Admin';

  constructor(
    private authService: AuthService,
    private adminService: AdminService, // Inyectamos el servicio
    private router: Router
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if (user) {
      this.username = user.username;
    }
  }

  // --- ESTA ES LA FUNCIÓN QUE TE FALTABA ---
  onUploadPdf(event: any) {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    // Validación simple
    if (file.type !== 'application/pdf') {
      Swal.fire('Error', 'Por favor sube un archivo PDF válido', 'error');
      return;
    }

    // Loading...
    Swal.fire({
      title: 'Procesando PDF...',
      text: 'Extrayendo alumnos y creando cuentas...',
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      }
    });

    // Llamada al Backend
    this.adminService.uploadUsersPdf(file).subscribe({
      next: (response) => {
        Swal.fire({
          icon: 'success',
          title: '¡Carga Exitosa!',
          text: 'Los alumnos han sido registrados correctamente.',
          confirmButtonText: 'Genial'
        });
      },
      error: (err) => {
        console.error(err);
        Swal.fire('Error', 'Hubo un problema al leer el PDF. Revisa el formato.', 'error');
      }
    });

    // Limpiar input
    event.target.value = '';
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
