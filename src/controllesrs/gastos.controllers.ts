
import {Request, Response} from 'express';
import {db} from '../config/database';
import {ResponseService} from '../utils/response';
import {CreateGastoDto, UpdateGastoDto, gasto} from '../types/gasto';


export const gastosController = {
    listar:(req: Request, res: Response) => {
        try{
            const gastos = db.prepare('SELECT * FROM gastos ORDER BY fecha DESC').all();
            return res.status(200).json(ResponseService.success(gastos, 200));
        } catch (error) {
            return res.status(500).json(
                ResponseService.error('INTERNAL_ERROR', 'Error al listar gastos', 500)
            );
        }
    },

    obtenerPorId: (req: Request, res: Response)=>{
        try{
            const {id} = req.params;
            if(isNaN(Number(id))) {
                return res.status(400).json(
                    ResponseService.error('VALIDATION_ERROR', 'ID debe ser un numero', 400)
                );
            }
               
            const gaste = db.prepare('SELECT * FROM gastos WHERE id = ?').get(id) as gasto;

            if (!gaste){
                return res.status(404).json(
                    ResponseService.error('NOT_FOUND', 'Gasto no encontrado', 404)
                );
            }  

            return res.status(200).json(ResponseService.success(gaste,200));
           
          }catch(error) {
            return res.status(500).json(
                ResponseService.error('INTERNAL_ERROR', 'Error al obtener gasto', 500)
            );
          }
    },

    crear:(req: Request, res: Response) => {
        try {
            const {descripcion, monto, categoria, fecha}: CreateGastoDto = req.body;
            if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length < 3) {
                return res.status(422).json(
                    ResponseService.error('VALIDATION_ERROR', 'Descripcion debe tener al menos 3 caracteres', 422)
                );
            }
            if (!monto || typeof monto !== 'number' || monto <= 0) {
                return res.status(422).json(
                    ResponseService.error('VALIDATION_ERROR', 'Monto debe ser un numero positivo', 422)
                );
            }
            if(!categoria || !['Comida', 'Transporte', 'Entretenimienmmto', 'Utilidades','Otros'].includes(categoria)){
              return res.status(422).json(
                ResponseService.error('VALIDATION_ERROR', 'Categoria no valida', 422)
              );  
            }
            if (!fecha || typeof fecha !== 'string'){
                return res.status(422).json(
                    ResponseService.error('VALIDATION_ERROR', 'Fecha es requerida', 422)
                );
            }

            const stmt = db.prepare(`
               INSERT INTO gastos (descripcion, monto, categoria, fecha)
               VALUES (?,?,?,?) `
            );

            const result = stmt.run(descripcion, monto, categoria, fecha);
            const nuevoGasto = db.prepare('SELECT * FROM gastos WHERE id = ?').get(result.lastInsertRowid);

            return res.status(201).json(ResponseService.success(nuevoGasto, 201));
        }catch (error) {
            return res.status(500).json (
                ResponseService.error('INTERNAL_ERROR', 'Error al crear gasto', 500)
            );
        }
    },

    actualizar: (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { descripcion, monto, categoria, fecha }: UpdateGastoDto = req.body;

      if (isNaN(Number(id))) {
        return res.status(400).json(
          ResponseService.error('VALIDATION_ERROR', 'ID debe ser un número', 400)
        );
      }

      const gastoExistente = db.prepare('SELECT * FROM gastos WHERE id = ?').get(id) as gasto;
      if (!gastoExistente) {
        return res.status(404).json(
          ResponseService.error('NOT_FOUND', 'Gasto no encontrado', 404)
        );
      }

      if (descripcion && (typeof descripcion !== 'string' || descripcion.trim().length < 3)) {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', 'Descripción inválida', 422)
        );
      }

      if (monto && (typeof monto !== 'number' || monto <= 0)) {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', 'Monto debe ser positivo', 422)
        );
      }

      if (categoria && !['Comida', 'Transporte', 'Entretenimiento', 'Utilities', 'Otros'].includes(categoria)) {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', 'Categoría no válida', 422)
        );
      }

      const stmt = db.prepare(`
        UPDATE gastos
        SET descripcion = ?, monto = ?, categoria = ?, fecha = ?, updatedAt = CURRENT_TIMESTAMP
        WHERE id = ?
      `);

      stmt.run(
        descripcion ?? gastoExistente.descripcion,
        monto ?? gastoExistente.monto,
        categoria ?? gastoExistente.categoria,
        fecha ?? gastoExistente.fecha,
        id
      );

      const gastoActualizado = db.prepare('SELECT * FROM gastos WHERE id = ?').get(id);

      return res.status(200).json(ResponseService.success(gastoActualizado, 200));
    } catch (error) {
      return res.status(500).json(
        ResponseService.error('INTERNAL_ERROR', 'Error al actualizar gasto', 500)
      );
    }
  },

  eliminar: (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json(
          ResponseService.error('VALIDATION_ERROR', 'ID debe ser un número', 400)
        );
      }

      const gastoExistente = db.prepare('SELECT * FROM gastos WHERE id = ?').get(id);
      if (!gastoExistente) {
        return res.status(404).json(
          ResponseService.error('NOT_FOUND', 'Gasto no encontrado', 404)
        );
      }

      db.prepare('DELETE FROM gastos WHERE id = ?').run(id);

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json(
        ResponseService.error('INTERNAL_ERROR', 'Error al eliminar gasto', 500)
      );
    }
  }
};
