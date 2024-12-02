import path from 'path';
import dotenv from 'dotenv';
import cacheService from './repository/service/cacheService';

// Initialize environment variables from variables.env
dotenv.config({ path: path.resolve(__dirname, './env/variables.env') });

import express from 'express';
import bodyParser from 'body-parser';
import index from './routes/index';

const app = express();
const port = process.env.PORT || 3000;

const startService = async () => {
    try{
        console.log(`Initializing facilities cache .....`);
        await cacheService.initializeCache();
        //cacheService.printCache(); // for development debugging
        cacheService.refreshCache();
    } catch (err) {
        console.log(`Failed to initialize Health Service facilities cache: ${err}`);
    }

    app.use(bodyParser.json());
    app.use('', index);
    
    app.listen(port, () => {
        console.log(`Server running on port ${port}`);
    });
};

startService();
