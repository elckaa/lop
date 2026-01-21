import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import Swal from 'sweetalert2';
import { AdminService } from '../../../services/admin';

declare var bootstrap: any;

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './users.html',
  styleUrl: './users.css'
})
export class UsersComponent implements OnInit {

  activeTab: string = 'DOCENTE'; 
  userList: any[] = [];

  isEditing: boolean = false;
  selectedUser: any = {
    id: null,
    username: '',
    email: '',
    password: '',
    role: 'DOCENTE'
  };

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers() {
    this.adminService.getUsersByRole(this.activeTab).subscribe({
      next: (data: any) => this.userList = data,
      error: (e: any) => console.error(e)
    });
  }

  switchTab(tab: string) {
    this.activeTab = tab;
    this.loadUsers();
  }

  openModal(user?: any) {
    if (user) {
      this.isEditing = true;
      // Mantenemos el rol que ya tiene el usuario para el select
      this.selectedUser = { ...user, password: '' };
    } else {
      this.isEditing = false;
      this.selectedUser = { id: null, username: '', email: '', password: '', role: this.activeTab };
    }
    const modal = new bootstrap.Modal(document.getElementById('userModal'));
    modal.show();
  }

  saveUser() {
    // Si no estamos editando, nos aseguramos que tenga el rol de la pestaña por defecto
    if (!this.isEditing && !this.selectedUser.role) {
      this.selectedUser.role = this.activeTab;
    }

    if (!this.selectedUser.username || !this.selectedUser.email) {
      Swal.fire('Faltan datos', 'Usuario y correo son obligatorios.', 'warning');
      return;
    }

    if (!this.isEditing && !this.selectedUser.password) {
      Swal.fire('Contraseña', 'La contraseña es obligatoria para nuevos usuarios.', 'warning');
      return;
    }

    if (this.isEditing) {
      if (!this.selectedUser.password) delete this.selectedUser.password;

      this.adminService.updateUser(this.selectedUser.id, this.selectedUser).subscribe({
        next: () => {
          Swal.fire('¡Éxito!', 'Usuario actualizado correctamente.', 'success');
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => Swal.fire('Error', 'No se pudo actualizar.', 'error')
      });
    } else {
      this.adminService.createUser(this.selectedUser).subscribe({
        next: () => {
          Swal.fire('¡Creado!', 'Usuario registrado correctamente.', 'success');
          this.loadUsers();
          this.closeModal();
        },
        error: (err) => Swal.fire('Error', 'No se pudo crear el usuario.', 'error')
      });
    }
  }

  deleteUser(user: any) {
    Swal.fire({
      title: '¿Eliminar?',
      text: `Se borrará a ${user.username}`,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, borrar'
    }).then((result) => {
      if (result.isConfirmed) {
        this.adminService.deleteUser(user.id).subscribe({
          next: () => {
            Swal.fire('Eliminado', 'Usuario borrado.', 'success');
            this.loadUsers();
          }
        });
      }
    });
  }

  closeModal() {
    const modalEl = document.getElementById('userModal');
    const modal = bootstrap.Modal.getInstance(modalEl);
    modal?.hide();
  }
}