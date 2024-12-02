import NodeCache from 'node-cache';
import { SqlDatabase } from "../database/sqlDatabase";
import { ONE_DAY_IN_MILLISECONDS } from '../../utils/constants';

class CacheService {
  private cache: NodeCache;
  private database: SqlDatabase;

  constructor() {
    this.cache = new NodeCache();
    this.database = new SqlDatabase();
  }

  createCompositeKey(customer_id: string, authorized_group: string, facility_id: string): string {
    return `${customer_id}:${authorized_group}:${facility_id}`;
  }

  async initializeCache(): Promise<void> {
    const facilities = await this.database.getFacilitiesCache();

    facilities.map((facility) => {
        if(facility.timezone_name) {
            const compositeKey = this.createCompositeKey(facility.customer_id, facility.authorized_group, facility.facility_id);
            this.cache.set(compositeKey, facility);
        }
    });

    const date = new Date(Date.now());
    const currentUtcDate = date.toUTCString();
    console.log(`Cache initialized with facilities data at ${currentUtcDate}.`);
  }

  refreshCache(): void {
    setInterval(async () => {
      const date = new Date(Date.now());
      const currentUtcDate = date.toUTCString();
      try {
        this.cache.flushAll();
        const facilities = await this.database.getFacilitiesCache();
        
        facilities.map((facility) => {
            if(facility.timezone_name) {
                const compositeKey = this.createCompositeKey(facility.customer_id, facility.authorized_group, facility.facility_id);
                this.cache.set(compositeKey, facility);
            }
        });

        console.log(`Cache refreshed with facilities data at ${currentUtcDate}.`);
      } catch (error) {
        console.error(`Error refreshing cache at ${currentUtcDate}:`, error);
      }
    }, ONE_DAY_IN_MILLISECONDS); // Refresh every 24 hours
  }

  printCache(): void {
    const keys = this.cache.keys();
    if (keys.length === 0) {
        console.log("Cache is empty.");
    } else {
        console.log("Current cache content:");
      keys.forEach((key) => {
        const value = this.cache.get(key);
        console.log(`Key: ${key}, Value:`, value);
      });
    }
  }

  get(key: string): any {
    return this.cache.get(key);
  }

  getRandomFacility(customer_id: string, authorized_group: string): any | null {
    const matchingKeys = this.cache.keys().filter((key) => {
      const [keyData1, keyData2] = key.split(":");
      return keyData1 === customer_id && keyData2 === authorized_group;
    });

    if (matchingKeys.length === 0) {
      console.log(`No entries found for data1: ${customer_id}, data2: ${authorized_group}`);
      return null;
    }

    const randomKey = matchingKeys[Math.floor(Math.random() * matchingKeys.length)];
    return this.cache.get(randomKey); // Return the randomly selected entry
  }
}

const cacheService = new CacheService();
export default cacheService;
