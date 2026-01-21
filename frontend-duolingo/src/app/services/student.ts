import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

// --- INTERFACES ---
export interface Ronda {
  id: number;
  titulo: string;
  descripcion: string;
  nivel: string;
  activo?: boolean;
  cantidadEjercicios?: number;
}

export interface Exercise {
  id: number;
  tipo: string;
  enunciado: string;
  contenido: string;
  opciones: string;
  respuestaCorrecta: string;
  opcionesArray?: string[];
}

export interface Progress {
  id: number;
  puntaje: number;
  fechaRealizacion: string;
  ronda: Ronda;
}

@Injectable({ providedIn: 'root' })
export class StudentService {
  private apiUrl = 'http://localhost:8080/api/student';
  private apiAdmin = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) {}

  // Endpoints
  getRondas(): Observable<Ronda[]> {
    return this.http.get<Ronda[]>(`${this.apiUrl}/rondas`);
  }

  getEjerciciosPorRonda(rondaId: number): Observable<Exercise[]> {
    return this.http.get<Exercise[]>(`${this.apiUrl}/rondas/${rondaId}/ejercicios`);
  }

  guardarProgreso(estudianteId: number, rondaId: number, puntaje: number): Observable<Progress> {
    const params = new HttpParams()
      .set('estudianteId', estudianteId)
      .set('rondaId', rondaId)
      .set('puntaje', puntaje);

    return this.http.post<Progress>(`${this.apiUrl}/progreso`, null, { params });
  }

  getHistorial(estudianteId: number): Observable<Progress[]> {
    return this.http.get<Progress[]>(`${this.apiUrl}/mi-historial/${estudianteId}`);
  }

  getMediaUrl(filename: string): string {
    return `${this.apiAdmin}/files/${filename}`;
  }
}
