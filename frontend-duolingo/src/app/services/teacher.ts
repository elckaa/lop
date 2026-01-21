import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

// DTO para crear/editar
export interface CrearRondaDTO {
  titulo: string;
  descripcion: string;
  nivel: string;
  ejercicios: any[];
}

// Interfaz completa de Ronda
export interface Ronda {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: string;
  creadorId: number;
  creadorNombre: string;
  cantidadEjercicios: number;
  activo?: boolean;
  ejercicios: any[];
}

// NUEVA: Interfaz para los Reportes de Notas
export interface ReporteProgreso {
  id: number;
  puntaje: number;
  fechaRealizacion: string;
  estudiante: {
    id: number;
    username: string;
  };
  ronda: {
    id: number;
    titulo: string;
    nivel: string;
  };
}

@Injectable({ providedIn: 'root' })
export class TeacherService {
  private apiRounds = 'http://localhost:8080/api/rounds';
  private apiAdmin = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  // 1. Obtener todas las rondas
  getRondas(): Observable<Ronda[]> {
    return this.http.get<Ronda[]>(this.apiRounds);
  }

  // 2. Obtener UNA ronda por ID
  getRondaById(id: number): Observable<Ronda> {
    return this.http.get<Ronda>(`${this.apiRounds}/${id}`);
  }

  // 3. Crear nueva ronda
  crearRonda(ronda: CrearRondaDTO): Observable<Ronda> {
    return this.http.post<Ronda>(this.apiRounds, ronda);
  }

  // 4. Actualizar ronda existente
  actualizarRonda(id: number, ronda: CrearRondaDTO): Observable<Ronda> {
    return this.http.put<Ronda>(`${this.apiRounds}/${id}`, ronda);
  }

  // 5. Activar/Desactivar
  toggleRonda(id: number): Observable<any> {
    return this.http.patch(`${this.apiRounds}/${id}/toggle`, {});
  }

  // 6. Eliminar
  eliminarRonda(id: number): Observable<any> {
    return this.http.delete(`${this.apiRounds}/${id}`);
  }

  // 7. Subir multimedia
  subirArchivo(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiAdmin}/upload-multimedia`, formData);
  }

  // 8. OBTENER REPORTES
  obtenerReporteGlobal(): Observable<ReporteProgreso[]> {
    return this.http.get<ReporteProgreso[]>(`${this.apiAdmin}/progreso-global`);
  }
}
