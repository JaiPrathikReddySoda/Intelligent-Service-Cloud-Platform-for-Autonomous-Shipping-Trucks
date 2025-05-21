import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  getStats
} from '../controllers/truckController';

const router = Router();

router.get('/stats', getStats);   
router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);

export default router;
