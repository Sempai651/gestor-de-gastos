export interface Gasto {
  id?: number;
  descripcion: string;
  monto: number;
  categoria: string;
  fecha: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  statusCode: number;
  data: T;
  error: null | {
    code: string;
    message: string;
  };
}

export interface Estadisticas {
  totalGastos: number;
  cantidadGastos: number;
  promedioPorGasto: number;
  porCategoria: {
    [key: string]: number;
  };
}