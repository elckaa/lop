import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdminService { // <--- ¡ASEGÚRATE QUE DIGA 'export'!

  // URL del Backend
  private apiUrl = 'http://localhost:8080/api/admin';

  constructor(private http: HttpClient) { }

  // 1. CARGA MASIVA: Enviar el PDF
  uploadUsersPdf(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post(`${this.apiUrl}/upload-users`, formData, { responseType: 'text' });
  }

  // 2. LISTAR USUARIOS
  getUsersByRole(role: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/users?role=${role}`);
  }

  // 3. CREAR USUARIO
  createUser(user: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/users`, user);
  }

  // 4. EDITAR USUARIO
  updateUser(id: number, user: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${id}`, user);
  }

  // 5. ELIMINAR USUARIO
  deleteUser(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${id}`, { responseType: 'text' });
  }
}
