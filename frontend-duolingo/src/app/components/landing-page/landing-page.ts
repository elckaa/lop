import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router'; // ¡Importante para navegar!

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [CommonModule, RouterLink], // Agregamos RouterLink aquí
  templateUrl: './landing-page.html',
  styleUrl: './landing-page.css'
})
export class LandingPageComponent {
  // No necesitamos lógica compleja por ahora, es solo visual
}
