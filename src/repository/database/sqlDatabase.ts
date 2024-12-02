import Database from "../../config/database";
import sql from 'mssql';

export class SqlDatabase {
    async getCustomerCfg (customer_id: string, authorized_group: string, tape_type: string, classification: string) {
        try {
            const pool = await Database.getInstance().getPool();
            const request = await pool.request();

            const query = 
            `
                SELECT
                    *
                FROM
                    trk.customer_cfg
                WHERE
                    customer_id = @CUSTOMER_ID
                    AND authorized_group = @AUTHORIZED_GROUP
                    AND tape_type = @TAPE_TYPE
                    AND classification = @CLASSIFICATION
            `;

            const results = await request
                .input('CUSTOMER_ID', sql.VarChar(50), customer_id)
                .input('AUTHORIZED_GROUP', sql.VarChar(50), authorized_group)
                .input('TAPE_TYPE', sql.VarChar(50), tape_type)
                .input('CLASSIFICATION', sql.VarChar(25), classification)
                .query(query);
    
            return results.recordset[0];
        } catch (err: any) {
            console.log(`Error in fetching customer cfg data from sql server for ${customer_id} and ${authorized_group}: ${err.message}`);
            throw err;
        }
    }

    async getFacilitiesCache() {
        try {
            const pool = await Database.getInstance().getPool();
            const request = await pool.request();

            const query = 
                `
                    SELECT
                        *
                    FROM
                        trk.facilities_db;
                `
            
            const facilitiesResults = await request.query(query);

            return facilitiesResults.recordset
        } catch (err) {
            throw err;
        }
    }
}
