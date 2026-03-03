import { Request, Response } from 'express';
import { Gasto, CreateGastoDto, UpdateGastoDto } from '../models/Gasto';
import { ResponseService } from '../utils/response';

export const gastosController = {
  listar: async (req: Request, res: Response) => {
    try {
      const gastos = await Gasto.findAll({
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

      // Validaciones manuales (Sequelize también valida)
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

      if (!categoria || !['Comida', 'Transporte', 'Entretenimiento', 'Utilities', 'Otros'].includes(categoria)) {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', 'Categoría no válida', 422)
        );
      }

      if (!fecha || typeof fecha !== 'string') {
        return res.status(422).json(
          ResponseService.error('VALIDATION_ERROR', 'Fecha es requerida', 422)
        );
      }

      // Crear gasto con Sequelize
      const nuevoGasto = await Gasto.create({
        descripcion,
        monto,
        categoria,
        fecha
      });

      return res.status(201).json(ResponseService.success(nuevoGasto, 201));
    } catch (error: any) {
      // Capturar errores de validación de Sequelize
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

      // Validaciones opcionales
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

      // Actualizar con Sequelize
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

      // Eliminar con Sequelize
      await gasto.destroy();

      return res.status(204).send();
    } catch (error) {
      return res.status(500).json(
        ResponseService.error('INTERNAL_ERROR', 'Error al eliminar gasto', 500)
      );
    }
  }
};