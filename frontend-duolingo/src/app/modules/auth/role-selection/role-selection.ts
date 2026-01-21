import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-role-selection',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './role-selection.html',
  styleUrls: ['./role-selection.css']
})
export class RoleSelectionComponent {}
