import { Request, Response } from 'express';
import { CosmosService } from '../repository/service/cosmosService';

class CosmosController {
    public async insertParcelsBulk ( req: Request, res: Response) {
        let customer_id, authorized_groups, count, tape_type, classification;
        try {
            customer_id = (req.headers.customer_id as string).toLowerCase();
            authorized_groups = (req.headers.authorized_groups as string).toLowerCase();
            ({ count, tape_type, classification } = req.body);
            
            console.log(`Creating bulk cosmos entries in Parcels continer for ${customer_id} and ${authorized_groups}`);
            
            const service = new CosmosService();
            service.insertParcelsBulkService(customer_id, authorized_groups, tape_type, classification, count);

            return res.status(201).send({
                message: `Successfully created ${count} bulk entries in cosmos Parcels container`
            });
        } catch (err: any) {
            console.log(`Failed to insert into cosmos for ${customer_id} and ${authorized_groups}: ${err.message}`);
            return res.status(500).json({
                error: err.message
            });
        }
    }
}

export default new CosmosController();
