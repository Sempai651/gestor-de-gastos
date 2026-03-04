import { Component } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="navbar">
      <div class="nav-container">
        <a routerLink="/" class="nav-logo">💰 Gestor de Gastos</a>
        <div class="nav-links">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}">🏠 Inicio</a>
          <a routerLink="/gastos" routerLinkActive="active">📋 Mis Gastos</a>
          <a routerLink="/estadisticas" routerLinkActive="active">📊 Estadísticas</a>
        </div>
      </div>
    </nav>
    <main>
      <router-outlet />
    </main>
  `,
  styles: [`
    .navbar { background: linear-gradient(135deg, #667eea, #764ba2); padding: 1rem 2rem; }
    .nav-container { max-width: 1200px; margin: 0 auto; display: flex; justify-content: space-between; align-items: center; }
    .nav-logo { color: white; font-size: 1.5rem; font-weight: bold; text-decoration: none; }
    .nav-links { display: flex; gap: 2rem; }
    .nav-links a { color: white; text-decoration: none; padding: 0.5rem 1rem; border-radius: 5px; }
    .nav-links a:hover { background: rgba(255,255,255,0.2); }
    .nav-links a.active { background: rgba(255,255,255,0.3); font-weight: bold; }
    main { min-height: calc(100vh - 70px); background: #f5f7fa; }
  `]
})
export class AppComponent {}