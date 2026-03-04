import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { GastoService } from '../../services/gasto.service';
import { Gasto } from '../../models/gasto.model';

@Component({
  selector: 'app-gastos',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="gastos-container">
      <h2>📋 Mis Gastos</h2>
      
      <!-- FORMULARIO -->
      <div class="form-card">
        <h3>{{ editando ? '✏️ Editar Gasto' : '➕ Nuevo Gasto' }}</h3>
        <form (ngSubmit)="guardar()">
          <div class="form-grid">
            <div class="form-group">
              <label>Descripción:</label>
              <input [(ngModel)]="gastoForm.descripcion" name="descripcion" required>
            </div>
            <div class="form-group">
              <label>Monto ($):</label>
              <input type="number" [(ngModel)]="gastoForm.monto" name="monto" required min="0.01" step="0.01">
            </div>
            <div class="form-group">
              <label>Categoría:</label>
              <select [(ngModel)]="gastoForm.categoria" name="categoria" required>
                <option value="">Seleccionar...</option>
                <option value="Comida">🍔 Comida</option>
                <option value="Transporte">🚗 Transporte</option>
                <option value="Entretenimiento">🎮 Entretenimiento</option>
                <option value="ServicioPublico">💡 Servicio Publico</option>
                <option value="Otros">📦 Otros</option>
              </select>
            </div>
            <div class="form-group">
              <label>Fecha:</label>
              <input type="date" [(ngModel)]="gastoForm.fecha" name="fecha" required>
            </div>
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-guardar">{{ editando ? 'Actualizar Gasto' : 'Guardar Gasto' }}</button>
            <button type="button" *ngIf="editando" (click)="cancelarEdicion()" class="btn-cancelar">Cancelar</button>
          </div>
        </form>
      </div>
      
      <!-- FILTROS -->
      <div class="filtros-card">
        <h3>🔍 Filtrar Gastos</h3>
        <div class="filtros-grid">
          <div class="form-group">
            <label>Categoría:</label>
            <select [(ngModel)]="filtros.categoria">
              <option value="">Todas</option>
              <option value="Comida">🍔 Comida</option>
              <option value="Transporte">🚗 Transporte</option>
              <option value="Entretenimiento">🎮 Entretenimiento</option>
              <option value="ServicioPublico">💡 Servicio Publico</option>
              <option value="Otros">📦 Otros</option>
            </select>
          </div>
          <div class="form-group">
            <label>Fecha inicio:</label>
            <input type="date" [(ngModel)]="filtros.fechaInicio">
          </div>
          <div class="form-group">
            <label>Fecha fin:</label>
            <input type="date" [(ngModel)]="filtros.fechaFin">
          </div>
        </div>
        <div class="filtros-acciones">
          <button (click)="aplicarFiltros()" class="btn-filtrar">🔍 Aplicar Filtros</button>
          <button (click)="limpiarFiltros()" class="btn-limpiar">🗑️ Limpiar Filtros</button>
        </div>
      </div>
      
      <!-- TABLA -->
      <div class="tabla-card">
        <h3>📋 Lista de Gastos</h3>
        <div *ngIf="cargando" class="loading">⏳ Cargando gastos...</div>
        <div *ngIf="error" class="error">{{ error }}</div>
        <div class="resumen" *ngIf="gastos.length > 0">
          <span class="resumen-item">💰 Total: \${{ calcularTotal() }}</span>
          <span class="resumen-item">📊 Cantidad: {{ gastos.length }} gastos</span>
        </div>
        <div *ngIf="gastos.length > 0 && !cargando" class="tabla-responsive">
          <table class="gastos-table">
            <thead>
              <tr>
                <th>Categoría</th>
                <th>Descripción</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr *ngFor="let gasto of gastos">
                <td>
                  <span class="categoria-badge" [style.background]="getColorCategoria(gasto.categoria)">
                    {{ getIconoCategoria(gasto.categoria) }} {{ gasto.categoria }}
                  </span>
                </td>
                <td>{{ gasto.descripcion }}</td>
                <td class="monto">\${{ gasto.monto.toFixed(2) }}</td>
                <td>{{ gasto.fecha }}</td>
                <td class="acciones">
                  <button (click)="editarGasto(gasto)" class="btn-editar" title="Editar">✏️</button>
                  <button (click)="eliminarGasto(gasto.id!)" class="btn-eliminar" title="Eliminar">🗑️</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <div *ngIf="gastos.length === 0 && !cargando" class="sin-datos">
          📭 No hay gastos registrados
        </div>
      </div>
    </div>
  `,
  styles: [`
    .gastos-container { max-width: 1200px; margin: 0 auto; padding: 2rem; }
    h2 { color: #2d3748; margin-bottom: 2rem; }
    .form-card, .filtros-card, .tabla-card { background: white; border-radius: 15px; padding: 1.5rem; margin-bottom: 2rem; box-shadow: 0 2px 5px rgba(0,0,0,0.05); }
    .form-grid, .filtros-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1.5rem 0; }
    .filtros-grid { grid-template-columns: repeat(3, 1fr); }
    .form-group { display: flex; flex-direction: column; }
    .form-group label { font-weight: 600; margin-bottom: 0.5rem; color: #4a5568; }
    .form-group input, .form-group select { padding: 0.75rem; border: 2px solid #e2e8f0; border-radius: 8px; }
    .btn-guardar { background: linear-gradient(135deg, #48bb78, #38a169); color: white; padding: 0.75rem 2rem; border: none; border-radius: 8px; }
    .btn-cancelar { background: #cbd5e0; color: #2d3748; padding: 0.75rem 2rem; border: none; border-radius: 8px; }
    .btn-filtrar { background: #667eea; color: white; padding: 0.75rem 2rem; border: none; border-radius: 8px; }
    .btn-limpiar { background: #cbd5e0; color: #2d3748; padding: 0.75rem 2rem; border: none; border-radius: 8px; }
    .resumen { background: #f7fafc; padding: 1rem; border-radius: 8px; margin-bottom: 1rem; display: flex; gap: 2rem; }
    .resumen-item { font-weight: bold; }
    .gastos-table { width: 100%; border-collapse: collapse; }
    .gastos-table th { background: #f7fafc; padding: 1rem; text-align: left; }
    .gastos-table td { padding: 1rem; border-bottom: 1px solid #e2e8f0; }
    .categoria-badge { padding: 0.25rem 0.75rem; border-radius: 20px; color: white; }
    .monto { font-weight: bold; color: #48bb78; }
    .acciones { display: flex; gap: 0.5rem; }
    .btn-editar { background: #fef3c7; color: #d69e2e; border: none; padding: 0.5rem; border-radius: 5px; }
    .btn-eliminar { background: #fee2e2; color: #dc2626; border: none; padding: 0.5rem; border-radius: 5px; }
    .loading, .error, .sin-datos { text-align: center; padding: 2rem; }
    .error { color: #dc2626; }
  `]
})
export class GastosComponent implements OnInit {
  gastos: Gasto[] = [];
  gastoForm: Partial<Gasto> = { descripcion: '', monto: 0, categoria: '', fecha: new Date().toISOString().split('T')[0] };
  filtros: any = { categoria: '', fechaInicio: '', fechaFin: '' };
  editando = false;
  cargando = true;
  error = '';

  constructor(private gastoService: GastoService) {}

  ngOnInit() { this.cargarGastos(); }

  cargarGastos() {
    this.gastoService.obtenerGastos().subscribe({
      next: (res) => { 
        this.gastos = res.data; 
        this.cargando = false; 
      },
      error: (err) => { 
        this.error = 'Error al cargar gastos'; 
        this.cargando = false; 
      }
    });
  }

  guardar() {
    if (this.editando) {
      this.gastoService.actualizarGasto(this.gastoForm.id!, this.gastoForm).subscribe({
        next: () => { 
          this.cancelarEdicion(); 
          this.cargarGastos(); 
        },
        error: (err) => this.error = 'Error al actualizar'
      });
    } else {
      this.gastoService.crearGasto(this.gastoForm as any).subscribe({
        next: () => { 
          this.limpiarFormulario(); 
          this.cargarGastos(); 
        },
        error: (err) => this.error = 'Error al crear'
      });
    }
  }

  editarGasto(gasto: Gasto) { 
    this.gastoForm = { ...gasto }; 
    this.editando = true; 
  }
  
  cancelarEdicion() { 
    this.limpiarFormulario(); 
    this.editando = false; 
  }
  
  limpiarFormulario() { 
    this.gastoForm = { 
      descripcion: '', 
      monto: 0, 
      categoria: '', 
      fecha: new Date().toISOString().split('T')[0] 
    }; 
  }

  eliminarGasto(id: number) {
    if (confirm('¿Eliminar gasto?')) {
      this.gastoService.eliminarGasto(id).subscribe({ 
        next: () => this.cargarGastos() 
      });
    }
  }

  aplicarFiltros() { 
    this.gastoService.obtenerGastos(this.filtros).subscribe(res => this.gastos = res.data); 
  }
  
  limpiarFiltros() { 
    this.filtros = { categoria: '', fechaInicio: '', fechaFin: '' }; 
    this.cargarGastos(); 
  }
  
  calcularTotal(): string { 
    return this.gastos.reduce((sum, g) => sum + g.monto, 0).toFixed(2); 
  }
  
  getIconoCategoria(cat: string): string { 
    const iconos: any = { 'Comida':'🍔','Transporte':'🚗','Entretenimiento':'🎮','Salud':'💊' }; 
    return iconos[cat] || '📦'; 
  }
  
  getColorCategoria(cat: string): string { 
    const colores: any = { 'Comida':'#f56565','Transporte':'#4299e1','Entretenimiento':'#ed8936','Salud':'#48bb78' }; 
    return colores[cat] || '#9f7aea'; 
  }
}