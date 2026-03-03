//import { Where } from './../../node_modules/sequelize/types/utils.d';
import { Request, Response } from 'express';
import { Gasto, CreateGastoDto, UpdateGastoDto } from '../models/Gasto';
import { ResponseService } from '../utils/response';
import { where } from 'sequelize';
import { number } from 'zod';

export const gastosController = {
  listar: async (req: Request, res: Response) => {
    try {
      const where: any = {};

/**
 * Filtrado por categoria 
 */

if (req.query.categoria && typeof req.query.categoria === 'string') {
  where.categoria = req.query.categoria;
}
/**
 * Filtrado por fecha 
 */

if (req.query.fecha_inicio || req.query.fecha_fin) {
  const { Op } = require('sequelize');
  where.fecha = {};
  
  if (req.query.fecha_inicio) {
    where.fecha[Op.gte] = req.query.fecha_inicio;
  }
  
  if (req.query.fecha_fin) {
    where.fecha[Op.lte] = req.query.fecha_fin;
  }
}

const gastos = await Gasto.findAll({
  where,
  order: [['fecha', 'DESC']]
});
      return res.status(200).json(ResponseService.success(gastos, 200));
    } catch (error) {
      return res.status(500).json(
        ResponseService.error('INTERNAL_ERROR', 'Error al listar gastos', 500)
      );
    }
  },

  obtenerPorId: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json(
          ResponseService.error('VALIDATION_ERROR', 'ID debe ser un número', 400)
        );
      }

      const gasto = await Gasto.findByPk(Number(id));

      if (!gasto) {
        return res.status(404).json(
          ResponseService.error('NOT_FOUND', 'Gasto no encontrado', 404)
        );
      }

      return res.status(200).json(ResponseService.success(gasto, 200));
    } catch (error) {
      return res.status(500).json(
        ResponseService.error('INTERNAL_ERROR', 'Error al obtener gasto', 500)
      );
    }
  },

  crear: async (req: Request, res: Response) => {
    try {
      const { descripcion, monto, categoria, fecha }: CreateGastoDto = req.body;

      
      /**
       * Validaciones
       */

      if (!descripcion || typeof descripcion !== 'string' || descripcion.trim().length < 3) {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', 'Descripción debe tener al menos 3 caracteres', 422)
        );
      }

      if (!monto || typeof monto !== 'number' || monto <= 0) {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', 'Monto debe ser un número positivo', 422)
        );
      }

      if (!categoria || !['Comida', 'Transporte', 'Entretenimiento', 'Servicio publico', 'Otros'].includes(categoria)) {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', 'Categoría no válida', 422)
        );
      }

      if (!fecha || typeof fecha !== 'string') {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', 'Fecha es requerida', 422)
        );
      }

      /**
       * Crear gastos
       */
      const nuevoGasto = await Gasto.create({
        descripcion,
        monto,
        categoria,
        fecha
      });

      return res.status(201).json(ResponseService.success(nuevoGasto, 201));
    } catch (error: any) {

      /**
       * captura errores
       */
      if (error.name === 'SequelizeValidationError') {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', error.errors[0].message, 422)
        );
      }

      return res.status(500).json(
        ResponseService.error('INTERNAL_ERROR', 'Error al crear gasto', 500)
      );
    }
  },

  actualizar: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { descripcion, monto, categoria, fecha }: UpdateGastoDto = req.body;

      if (isNaN(Number(id))) {
        return res.status(400).json(
          ResponseService.error('VALIDATION_ERROR', 'ID debe ser un número', 400)
        );
      }

      const gastoExistente = await Gasto.findByPk(Number(id)) as Gasto;
      if (!gastoExistente) {
        return res.status(404).json(
          ResponseService.error('NOT_FOUND', 'Gasto no encontrado', 404)
        );
      }

      /**
       * Validaciones opcionales 
       */

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

      if (categoria && !['Comida', 'Transporte', 'Entretenimiento', 'Servicio publico', 'Otros'].includes(categoria)) {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', 'Categoría no válida', 422)
        );
      }

      /**
       * Actualizar 
       */


      await gastoExistente.update({
        descripcion: descripcion ?? gastoExistente.descripcion,
        monto: monto ?? gastoExistente.monto,
        categoria: categoria ?? gastoExistente.categoria,
        fecha: fecha ?? gastoExistente.fecha
      });

      return res.status(200).json(ResponseService.success(gastoExistente, 200));
    } catch (error: any) {
      if (error.name === 'SequelizeValidationError') {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', error.errors[0].message, 422)
        );
      }

      return res.status(500).json(
        ResponseService.error('INTERNAL_ERROR', 'Error al actualizar gasto', 500)
      );
    }
  },

  eliminar: async (req: Request, res: Response) => {
    try {
      const { id } = req.params;

      if (isNaN(Number(id))) {
        return res.status(400).json(
          ResponseService.error('VALIDATION_ERROR', 'ID debe ser un número', 400)
        );
      }

      const gasto = await Gasto.findByPk(Number(id));
      if (!gasto) {
        return res.status(404).json(
          ResponseService.error('NOT_FOUND', 'Gasto no encontrado', 404)
        );
      }

      /**
       * eliminar
       */
      await gasto.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json(
        ResponseService.error('INTERNAL_ERROR', 'Error al eliminar gasto', 500)
      );
    }
  },
     
    /**
     *  Calcular y mostrar estadisticas 
     */

    estadisticas: async (req: Request, res: Response) => {
      try {
         
        const gastos = await Gasto.findAll();

        if (gastos.length === 0) {
          return res.status(200).json (
            ResponseService.success(
              {
                totalGastos:0,
                cantidadGastos:0,
                promedioPorGastos:0,
                porCategoria: {
                  Comida: 0,
                  Transporte: 0,
                  Entrenamiento: 0,
                  ServiciosPublicos: 0,
                  Otros: 0 
                }
              },
              200
            )
          );
        }
        
      const totalGastos = gastos.reduce((sum, gasto) => sum + Number(gasto.monto), 0);

      const cantidadGastos = gastos.length;

      const promedioPorGasto = cantidadGastos > 0 ? totalGastos / cantidadGastos : 0;

      const porCategoria = {
        Comida: 0,
        Transporte: 0,
        Entretenimiento: 0,
        ServiciosPublicos: 0,
        otros: 0
      };

      gastos.forEach((gasto)=> {
        porCategoria[gasto.categoria as keyof typeof porCategoria] += Number(gasto.monto);
      });
      
      return res.status(200).json(
        ResponseService.success({

          totalGastos: Number(totalGastos.toFixed(2)),
          cantidadGastos,
          promedioPorGasto: Number(promedioPorGasto.toFixed(2)),
          porCategoria

        },
        200
      )
      );



      }catch (error) {
        return res.status(500).json(
          ResponseService.error('INTERNAL_ERROR', 'error al obtener estadisticas', 500)

        );
      }
  }
};

