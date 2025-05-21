import { Router } from 'express';
import {
  getAll,
  getById,
  create,
  update,
  remove,
  getServiceRequestStats,
} from '../controllers/serviceRequestController';

const router = Router();

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', create);
router.put('/:id', update);
router.delete('/:id', remove);
router.get('/stats', getServiceRequestStats);

export default router;

