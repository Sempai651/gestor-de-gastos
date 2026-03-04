import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GastoService } from '../../services/gasto.service';
import { Estadisticas } from '../../models/gasto.model';

@Component({
  selector: 'app-estadisticas',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="estadisticas-container">
      <h2>📊 Estadísticas</h2>
      
      <div *ngIf="cargando" class="loading">⏳ Cargando estadísticas...</div>
      <div *ngIf="error" class="error">{{ error }}</div>
      
      <div *ngIf="!cargando && !error" class="estadisticas-grid">
        <!-- Tarjetas principales -->
        <div class="stat-card" style="background: linear-gradient(135deg, #667eea, #764ba2);">
          <div class="stat-label">💰 Total Gastado</div>
          <div class="stat-value">\${{ stats.totalGastos.toFixed(2) }}</div>
        </div>
        
        <div class="stat-card" style="background: linear-gradient(135deg, #48bb78, #38a169);">
          <div class="stat-label">📋 Cantidad de Gastos</div>
          <div class="stat-value">{{ stats.cantidadGastos }}</div>
        </div>
        
        <div class="stat-card" style="background: linear-gradient(135deg, #ed8936, #dd6b20);">
          <div class="stat-label">📈 Promedio por Gasto</div>
          <div class="stat-value">\${{ stats.promedioPorGasto.toFixed(2) }}</div>
        </div>
        
        <!-- Tabla por categoría -->
        <div class="categorias-card" *ngIf="categorias.length > 0">
          <h3>📊 Distribución por Categoría</h3>
          <div *ngFor="let cat of categorias" class="categoria-item">
            <div class="categoria-header">
              <span>{{ getIconoCategoria(cat) }} {{ cat }}</span>
              <span>\${{ stats.porCategoria[cat].toFixed(2) }}</span>
            </div>
            <div class="progress-bar">
              <div class="progress-fill" [style.width.%]="calcularPorcentaje(stats.porCategoria[cat])" 
                   [style.background]="getColorCategoria(cat)"></div>
            </div>
            <div class="porcentaje">{{ calcularPorcentaje(stats.porCategoria[cat]) }}%</div>
          </div>
        </div>
        
        <button (click)="refrescar()" class="btn-refrescar">🔄 Refrescar</button>
      </div>
    </div>
  `,
  styles: [`
    .estadisticas-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    h2 { color: #2d3748; margin-bottom: 2rem; }
    .estadisticas-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 1.5rem; }
    .stat-card { padding: 2rem; border-radius: 15px; color: white; text-align: center; }
    .stat-label { font-size: 1rem; opacity: 0.9; margin-bottom: 0.5rem; }
    .stat-value { font-size: 2rem; font-weight: bold; }
    .categorias-card { grid-column: span 3; background: white; border-radius: 15px; padding: 2rem; margin-top: 1rem; }
    .categoria-item { margin-bottom: 1.5rem; }
    .categoria-header { display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-weight: 500; }
    .progress-bar { height: 20px; background: #e2e8f0; border-radius: 10px; overflow: hidden; }
    .progress-fill { height: 100%; transition: width 0.3s; }
    .porcentaje { text-align: right; font-size: 0.9rem; color: #718096; margin-top: 0.25rem; }
    .btn-refrescar { grid-column: span 3; background: #667eea; color: white; padding: 1rem; border: none; border-radius: 8px; cursor: pointer; font-size: 1.1rem; }
    .loading, .error { grid-column: span 3; text-align: center; padding: 2rem; }
    .error { color: #dc2626; }
  `]
})
export class EstadisticasComponent implements OnInit {
  stats: Estadisticas = { 
    totalGastos: 0, 
    cantidadGastos: 0, 
    promedioPorGasto: 0, 
    porCategoria: {} 
  };
  categorias: string[] = [];
  cargando = true;
  error = '';

  constructor(private gastoService: GastoService) {}

  ngOnInit() { 
    this.cargarEstadisticas(); 
  }

  cargarEstadisticas() {
    this.gastoService.obtenerEstadisticas().subscribe({
      next: (res) => { 
        // Asegurar que todos los valores existen
        this.stats = {
          totalGastos: res.data.totalGastos || 0,
          cantidadGastos: res.data.cantidadGastos || 0,
          promedioPorGasto: res.data.promedioPorGasto || 0,
          porCategoria: res.data.porCategoria || {}
        };
        this.categorias = Object.keys(this.stats.porCategoria); 
        this.cargando = false; 
      },
      error: (err) => { 
        this.error = 'Error al cargar estadísticas'; 
        this.cargando = false; 
      }
    });
  }

  refrescar() { 
    this.cargarEstadisticas(); 
  }
  
  getIconoCategoria(cat: string): string { 
    const iconos: any = { 
      'Comida':'🍔', 
      'Transporte':'🚗', 
      'Entretenimiento':'🎮', 
      'Salud':'💊' 
    }; 
    return iconos[cat] || '📦'; 
  }
  
  getColorCategoria(cat: string): string { 
    const colores: any = { 
      'Comida':'#f56565', 
      'Transporte':'#4299e1', 
      'Entretenimiento':'#ed8936', 
      'Salud':'#48bb78' 
    }; 
    return colores[cat] || '#9f7aea'; 
  }
  
  calcularPorcentaje(valor: number): number { 
    if (!valor || !this.stats.totalGastos) return 0;
    return Number(((valor / this.stats.totalGastos) * 100).toFixed(1)); 
  }
}