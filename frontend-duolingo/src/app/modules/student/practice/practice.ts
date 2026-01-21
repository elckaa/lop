import { Component, OnInit, ChangeDetectorRef } from '@angular/core'; // <--- 1. Importar
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';

import { StudentService, Exercise } from '../../../services/student';
import { AuthService } from '../../../services/auth';

@Component({
  selector: 'app-practice',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './practice.html',
  styleUrls: ['./practice.css']
})
export class PracticeComponent implements OnInit {

  rondaId: number = 0;
  estudianteId: number = 0;

  ejercicios: Exercise[] = [];
  ejercicioActual: Exercise | null = null;
  indiceActual: number = 0;

  respuestaUsuario: string = '';
  puntajeAcumulado: number = 0;
  juegoTerminado: boolean = false;
  cargando: boolean = true;
  notaFinal: number = 0;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private studentService: StudentService,
    private authService: AuthService,
    private cd: ChangeDetectorRef // <--- 2. Inyectar aquí
  ) {}

  ngOnInit(): void {
    const user = this.authService.getUser();
    if(user) this.estudianteId = user.id;

    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.rondaId = +id;
        this.cargarEjercicios();
      }
    });
  }

  cargarEjercicios() {
    this.cargando = true;
    this.studentService.getEjerciciosPorRonda(this.rondaId).subscribe({
      next: (data: Exercise[]) => {
        console.log('Ejercicios cargados:', data);
        this.ejercicios = data || [];

        this.ejercicios.forEach(ex => {
          if (ex.opciones && !ex.opcionesArray) {
            ex.opcionesArray = ex.opciones.split(',');
          }
        });

        if (this.ejercicios.length > 0) {
          this.indiceActual = 0;
          this.ejercicioActual = this.ejercicios[0];
        }

        this.cargando = false;
        this.cd.detectChanges(); // <--- 3. ¡OBLIGATORIO PARA QUITAR SPINNER!
      },
      error: (err: any) => {
        console.error(err);
        this.cargando = false;
        this.cd.detectChanges();
        Swal.fire('Error', 'No se pudieron cargar los ejercicios', 'error');
      }
    });
  }

  // ... Resto de métodos (verificarRespuesta, siguienteEjercicio, etc.) IGUAL QUE ANTES ...

  verificarRespuesta() {
    if (!this.ejercicioActual) return;
    if (!this.respuestaUsuario || !this.respuestaUsuario.trim()) return;

    const correcta = this.ejercicioActual.respuestaCorrecta.trim().toLowerCase();
    const usuario = this.respuestaUsuario.trim().toLowerCase();

    if (correcta === usuario) {
      this.puntajeAcumulado++;
      Swal.fire({ icon: 'success', title: '¡Correcto!', timer: 1000, showConfirmButton: false });
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Incorrecto',
        text: `La respuesta era: ${this.ejercicioActual.respuestaCorrecta}`,
        confirmButtonText: 'Continuar'
      });
    }
    this.siguienteEjercicio();
  }

  siguienteEjercicio() {
    this.respuestaUsuario = '';
    this.indiceActual++;

    if (this.indiceActual < this.ejercicios.length) {
      this.ejercicioActual = this.ejercicios[this.indiceActual];
    } else {
      this.finalizarJuego();
    }
    this.cd.detectChanges(); // <--- Actualizar vista al cambiar pregunta
  }

  finalizarJuego() {
    this.juegoTerminado = true;
    this.notaFinal = this.ejercicios.length > 0
      ? Math.round((this.puntajeAcumulado * 100) / this.ejercicios.length)
      : 0;

    this.cd.detectChanges(); // <--- Mostrar pantalla final

    this.studentService.guardarProgreso(this.estudianteId, this.rondaId, this.notaFinal).subscribe({
      next: () => console.log('Progreso guardado'),
      error: (err: any) => console.error('Error al guardar', err)
    });
  }

  volverAlDashboard() {
    this.router.navigate(['/student/dashboard']);
  }

  getMedia(filename: string) {
    return `http://localhost:8080/uploads/${filename}`;
  }
}
