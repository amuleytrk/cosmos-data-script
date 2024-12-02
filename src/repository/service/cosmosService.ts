import { SqlDatabase } from '../database/sqlDatabase';
import { IParcels, IFacility } from '../../models/cosmosModels';
import { 
    getRandomDateTime,
    getRandomLastSeenAndExpiry 
} from '../../utils/dateTimeUtils';
import { fetchRandomFacility } from '../../utils/facilityUtils';
import cacheService from './cacheService';


export class CosmosService {
    sqlDatabase: SqlDatabase;

    constructor () {
        this.sqlDatabase = new SqlDatabase();
    }

    async insertParcelsBulkService(customer_id: string, authorized_group: string, tape_type: string, classification: string, count: number) {
        try {
            const customer_cfg = await this.sqlDatabase.getCustomerCfg(customer_id, authorized_group, tape_type, classification);
            
            let insertData: IParcels[] = [];
            let tapeCount = "0000";
            let scantypes = ["5258", "5264"];

            // creating an array of objects for inserting data
            for (let curr = 1; curr <= count; curr++){
                let data: IParcels;
                tapeCount = (parseInt(tapeCount, 10) + 1).toString().padStart(4, "0");

                const tape_id = "Bulk-Tape-ID-" + tapeCount;
                const asset_bar_code = "Bulk-Tape-AssetBarCode-" + tapeCount;
                const asset_bar_code_q = "BulkTapeAssetBarCode" + tapeCount;
                const qrcode = "Bulk-Tape-Qrcode-" + tapeCount;
                const qrcode_q = ("BulkTapeQrcode" + tapeCount).toLowerCase();
                const { last_seen_time, expiry_time } = getRandomLastSeenAndExpiry();
                const scantypeIndex = Math.floor(Math.random() * scantypes.length);
                const current_facility: IFacility = await fetchRandomFacility(customer_id, authorized_group);
                const current_facility_data = await cacheService.get(`${customer_id}:${authorized_group}:${current_facility.facility_id}`);
                const scan_facility: IFacility = await fetchRandomFacility(customer_id, authorized_group);

                data = {
                    id: tape_id,
                    application_id: customer_cfg.application_id,
                    tape_id: tape_id,
                    tape_type: customer_cfg.tape_type,
                    customer_id: customer_id,
                    authorized_groups: authorized_group,
                    activation_date: getRandomDateTime(),
                    device_status: "1",
                    excursions: [],
                    asset_bar_code: asset_bar_code,
                    asset_bar_code_q: asset_bar_code_q,
                    qrcode: qrcode,
                    qrcode_q: qrcode_q,
                    tape_personality: customer_cfg.classification,
                    last_seen_time: last_seen_time,
                    expiry_time: expiry_time,
                    apn: "bulk_parcels_insertion@trackonomy.com",
                    notes: "",
                    scantype: scantypes[scantypeIndex],
                    application_name: customer_cfg.application_name,
                    current_facility: current_facility,
                    lat: current_facility_data.lat,
                    lon: current_facility_data.lon,
                    facility: {
                        facility_id: current_facility.facility_id
                    },
                    last_seen_milestone: current_facility.facility_desc,
                    last_seen_milestone_q: current_facility.facility_desc,
                    scan_facility: scan_facility,
                }

                insertData.push(data);
            }

            console.log(insertData);
        } catch (err: any) {
            console.log(`Error in creating bulk cosmos entries for ${customer_id} and ${authorized_group}: ${err.message}`);
            throw err;
        }
    }
}
