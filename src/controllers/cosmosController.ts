import { Request, Response } from 'express';
import { CosmosService } from '../repository/service/cosmosService';

export class CosmosController {

    public async insertParcelsBulk ( req: Request, res: Response) {
        let customer_id, authorized_groups, count, tape_type, classification;
        try {
            customer_id = (req.headers.customer_id as string).toLowerCase();
            authorized_groups = (req.headers.authorized_groups as string).toLowerCase();
            ({ count, tape_type, classification } = req.body);
            
            console.log(`Creating bulk cosmos entries in Parcels continer for ${customer_id} and ${authorized_groups}`);
            
            const service = new CosmosService();
            await service.insertParcelsBulkService(customer_id, authorized_groups, tape_type, classification, count);

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

    public async deleteParcelBulk ( req: Request, res: Response ) {
        let customer_id, authorized_groups;

        try {
            customer_id = (req.headers.customer_id as string).toLowerCase();
            authorized_groups = (req.headers.authorized_groups as string).toLowerCase();
            
            const service = new CosmosService();
            await service.deleteParcelsBulkService(customer_id, authorized_groups);

            return res.status(201).send({
                message: `Successfully deleted all bulk entries in cosmos Parcels container for ${customer_id} and ${authorized_groups}`
            });
        } catch (err: any) {
            console.log(`Failed to delete bulk entries in cosmos Parcels container for ${customer_id} and ${authorized_groups}: ${err.message}`);
            return res.status(500).json({
                error: err.message
            });
        }
    }
}
