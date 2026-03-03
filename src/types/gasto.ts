


 export interface Gasto {
  id?: number;
  descripcion: string;
  monto: number;
  categoria: 'Comida' | 'Transporte' | 'Entretenimiento' | 'Servicios publicos' | 'Otros';
  fecha: string;
  createdAt?: string;

 };


 /**
  * Cramos un gasto pero todos son      obligatorios
  */

 export type CreateGastoDto = Omit<Gasto, 'id' | 'createdAt'>;

 /**
  * actualizamos pero todos los cmapos son opcionales
  */
 export type UpdateGastoDto = Partial<CreateGastoDto>;
