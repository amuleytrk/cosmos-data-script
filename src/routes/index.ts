import { Router } from 'express';
import cosmosController from '../controllers/cosmosController';

const databaseRouter = Router();

databaseRouter.post('/insert/cosmos/parcels', cosmosController.insertParcelsBulk);

export default databaseRouter;
