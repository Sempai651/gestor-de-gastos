import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-bienvenida',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="welcome-container">
      <div class="welcome-card">
        <h1>💰 Gestor de Gastos Personal</h1>
        <p class="subtitle">Controla tus finanzas de manera fácil y rápida</p>
        
        <div class="features">
          <div class="feature"><span class="feature-icon">📝</span><h3>Registra Gastos</h3><p>Agrega tus gastos diarios</p></div>
          <div class="feature"><span class="feature-icon">🔍</span><h3>Filtra y Busca</h3><p>Encuentra gastos por categoría y fecha</p></div>
          <div class="feature"><span class="feature-icon">📊</span><h3>Ve Estadísticas</h3><p>Visualiza totales y promedios</p></div>
          <div class="feature"><span class="feature-icon">✏️</span><h3>Edita y Elimina</h3><p>Mantén todo actualizado</p></div>
        </div>
        
        <a routerLink="/gastos" class="btn-comenzar">🚀 Comenzar</a>
      </div>
    </div>
  `,
  styles: [`
    .welcome-container { min-height: calc(100vh - 70px); display: flex; align-items: center; justify-content: center; padding: 2rem; background: linear-gradient(135deg, #667eea20, #764ba220); }
    .welcome-card { background: white; border-radius: 30px; padding: 3rem; max-width: 1000px; box-shadow: 0 20px 40px rgba(0,0,0,0.1); text-align: center; }
    h1 { font-size: 2.5rem; color: #2d3748; margin-bottom: 0.5rem; }
    .subtitle { font-size: 1.2rem; color: #718096; margin-bottom: 3rem; }
    .features { display: grid; grid-template-columns: repeat(2, 1fr); gap: 2rem; margin-bottom: 3rem; }
    .feature { padding: 1.5rem; border-radius: 15px; background: #f8fafc; }
    .feature-icon { font-size: 3rem; display: block; margin-bottom: 1rem; }
    .btn-comenzar { display: inline-block; background: linear-gradient(135deg, #667eea, #764ba2); color: white; padding: 1rem 3rem; border-radius: 50px; text-decoration: none; font-weight: bold; }
  `]
})
export class BienvenidaComponent {}