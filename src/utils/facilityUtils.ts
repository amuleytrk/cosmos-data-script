import cacheService from '../repository/service/cacheService';
import { IFacility } from '../models/cosmosModels';

export async function fetchRandomFacility(customer_id: string, authorized_group: string): Promise<IFacility> {
    const facility = await cacheService.getRandomFacility(customer_id, authorized_group);

    const randomFacility: IFacility = {
        facility_id: facility.facility_id,
        location_desc: facility.facility_designation,
        location_id: facility.location_id,
        facility_desc: facility.facility_designation_description,
        parents: [ facility.parent_facility_id ],
        timezone: {
            name: facility.timezone_name
        }
    }

    return randomFacility;
}
