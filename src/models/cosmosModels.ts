interface IParcels {
    id: string;
    application_id: string;
    tape_id: string;
    tape_type: string;
    customer_id: string;
    authorized_groups: string;
    activation_date: string;
    device_status: string;
    excursions: [];
    asset_bar_code: string;
    asset_bar_code_q: string;
    qrcode: string;
    qrcode_q: string;
    tape_personality: string;
    last_seen_time: number;
    expiry_time: number;
    apn: string;
    notes: string;
    scantype: string;
    application_name: string;
    current_facility: IFacility;
    lat: string;
    lon: string;
    facility: {
        facility_id: string;
    },
    last_seen_milestone: string;
    last_seen_milestone_q: string;
    scan_facility: IFacility;
}

interface IFacility {
    facility_id: string;
    location_desc: string;
    location_id: string;
    facility_desc: string;
    parents: [ string ];
    timezone: {
        name: string;
    }
}

export {
    IParcels,
    IFacility
}
