import { Router } from 'express';
import { CosmosController } from '../controllers/cosmosController';

const databaseRouter = Router();
const cosmosController = new CosmosController();

databaseRouter.post('/insert/cosmos/parcels', cosmosController.insertParcelsBulk);
databaseRouter.post('/delete/cosmos/parcels', cosmosController.deleteParcelBulk);

export default databaseRouter;
