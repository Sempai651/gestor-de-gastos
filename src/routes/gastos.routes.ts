import { Router } from 'express';
import { gastosController } from '../controllesrs/gastos.controllers';

const router = Router();

router.get('/', gastosController.listar);
router.get('/:id', gastosController.obtenerPorId);
router.post('/', gastosController.crear);
router.put('/:id', gastosController.actualizar);
router.delete('/:id', gastosController.eliminar);

export default router;