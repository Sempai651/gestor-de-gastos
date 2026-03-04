import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Gasto, ApiResponse, Estadisticas } from '../models/gasto.model';

@Injectable({ providedIn: 'root' })
export class GastoService {
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) {}   

  obtenerGastos(filtros?: { categoria?: string; fechaInicio?: string; fechaFin?: string }): Observable<ApiResponse<Gasto[]>> {
    let params = new HttpParams();
    if (filtros?.categoria) params = params.set('categoria', filtros.categoria);
    if (filtros?.fechaInicio) params = params.set('fecha_inicio', filtros.fechaInicio);
    if (filtros?.fechaFin) params = params.set('fecha_fin', filtros.fechaFin);
    return this.http.get<ApiResponse<Gasto[]>>(`${this.apiUrl}/gastos`, { params });
  }

  obtenerGastoPorId(id: number): Observable<ApiResponse<Gasto>> {
    return this.http.get<ApiResponse<Gasto>>(`${this.apiUrl}/gastos/${id}`);
  }

  crearGasto(gasto: Omit<Gasto, 'id' | 'createdAt' | 'updatedAt'>): Observable<ApiResponse<Gasto>> {
    return this.http.post<ApiResponse<Gasto>>(`${this.apiUrl}/gastos`, gasto);
  }

  actualizarGasto(id: number, gasto: Partial<Gasto>): Observable<ApiResponse<Gasto>> {
    return this.http.put<ApiResponse<Gasto>>(`${this.apiUrl}/gastos/${id}`, gasto);
  }

  eliminarGasto(id: number): Observable<ApiResponse<void>> {
    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/gastos/${id}`);
  }

  obtenerEstadisticas(): Observable<ApiResponse<Estadisticas>> {
    return this.http.get<ApiResponse<Estadisticas>>(`${this.apiUrl}/gastos/estadisticas`);
  }
}