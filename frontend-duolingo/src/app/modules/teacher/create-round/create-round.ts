import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TeacherService } from '../../../services/teacher';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-create-round',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './create-round.html',
  styleUrls: ['./create-round.css']
})
export class CreateRoundComponent implements OnInit {

  ronda: any = {
    titulo: '',
    descripcion: '',
    nivel: 'A1',
    ejercicios: []
  };

  tipos = ['TRADUCCION', 'LISTENING', 'IMAGEN', 'SELECCION_MULTIPLE', 'PRONUNCIACION', 'VERDADERO_FALSO'];
  enviando = false;
  esEdicion = false;
  idRonda: number | null = null;

  constructor(
    private teacherService: TeacherService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Detectar si venimos a editar (hay ID en la URL)
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.esEdicion = true;
        this.idRonda = +id;
        this.cargarDatosRonda(this.idRonda);
      } else {
        // Modo Creación: agregamos un ejercicio vacío por defecto
        this.agregarEjercicio();
      }
    });
  }

  cargarDatosRonda(id: number) {
    // Mostrar loading mientras carga
    Swal.fire({
      title: 'Cargando datos...',
      didOpen: () => Swal.showLoading()
    });

    this.teacherService.getRondaById(id).subscribe({
      next: (data: any) => {
        this.ronda = data;

        // Asegurarnos de que opcionesArray exista para el frontend (convertir string a array)
        if (this.ronda.ejercicios) {
          this.ronda.ejercicios.forEach((ex: any) => {
             if (ex.opciones && (!ex.opcionesArray || ex.opcionesArray.length === 0)) {
               ex.opcionesArray = ex.opciones.split(',');
             } else if (!ex.opcionesArray) {
               ex.opcionesArray = [''];
             }
          });
        }

        Swal.close();
      },
      error: () => {
        Swal.fire('Error', 'No se pudo cargar la ronda solicitada', 'error');
        this.router.navigate(['/teacher/dashboard']);
      }
    });
  }

  agregarEjercicio() {
    this.ronda.ejercicios.push({
      tipo: 'TRADUCCION',
      enunciado: '',
      contenido: '',
      respuestaCorrecta: '',
      opciones: '',
      opcionesArray: ['']
    });
  }

  eliminarEjercicio(index: number) {
    this.ronda.ejercicios.splice(index, 1);
  }

  agregarOpcion(exIndex: number) {
    this.ronda.ejercicios[exIndex].opcionesArray.push('');
  }

  quitarOpcion(exIndex: number, optIndex: number) {
    const opciones = this.ronda.ejercicios[exIndex].opcionesArray;
    if (opciones.length > 1) {
      opciones.splice(optIndex, 1);
    }
  }

  onFileSelected(event: any, index: number) {
    const file = event.target.files[0];
    if (file) {
      // Subida inmediata del archivo
      this.teacherService.subirArchivo(file).subscribe({
        next: (res: any) => {
          this.ronda.ejercicios[index].contenido = res.fileName;

          // Toast de éxito
          const Toast = Swal.mixin({
            toast: true, position: 'top-end', showConfirmButton: false, timer: 2000
          });
          Toast.fire({ icon: 'success', title: 'Archivo subido correctamente' });
        },
        error: () => Swal.fire('Error', 'No se pudo subir el archivo', 'error')
      });
    }
  }

  guardarRonda() {
    // Validaciones básicas
    if (!this.ronda.titulo || !this.ronda.titulo.trim()) {
      Swal.fire('Atención', 'Ponle un título a la ronda', 'warning');
      return;
    }
    if (!this.ronda.ejercicios || this.ronda.ejercicios.length === 0) {
      Swal.fire('Atención', 'Agrega al menos un ejercicio', 'warning');
      return;
    }

    this.enviando = true;

    // Procesar opcionesArray a string para el backend
    this.ronda.ejercicios.forEach((ex: any) => {
      if (Array.isArray(ex.opcionesArray)) {
        ex.opciones = ex.opcionesArray.filter((o: string) => o && o.trim() !== '').join(',');
      }
    });

    if (this.esEdicion && this.idRonda) {
      // --- MODO EDICIÓN (PUT) ---
      this.teacherService.actualizarRonda(this.idRonda, this.ronda).subscribe({
        next: () => {
          Swal.fire('¡Actualizado!', `La ronda "${this.ronda.titulo}" ha sido modificada`, 'success');
          this.router.navigate(['/teacher/dashboard']);
        },
        error: (err) => {
          this.enviando = false;
          console.error(err);
          Swal.fire('Error', 'No se pudo actualizar la ronda', 'error');
        }
      });
    } else {
      // --- MODO CREACIÓN (POST) ---
      this.teacherService.crearRonda(this.ronda).subscribe({
        next: (nuevaRonda: any) => {
          Swal.fire('¡Creado!', `Ronda "${nuevaRonda.titulo}" creada exitosamente`, 'success');
          this.router.navigate(['/teacher/dashboard']);
        },
        error: (err) => {
          this.enviando = false;
          console.error(err);
          Swal.fire('Error', 'No se pudo guardar la ronda', 'error');
        }
      });
    }
  }
}
