const { CosmosClient } = require("@azure/cosmos");

let database;

const init = () => {
    const client = new CosmosClient({
        endpoint: process.env.COSMOS_ENDPOINT,
        key: process.env.COSMOS_PRIMARY_KEY,
    });
    database = client.database(process.env.COSMOS_DBNAME);
}

const getInstance = () => {
    return database;
}

// function to split dataArray into multiple chunks
function arrayChunks(array, chunkSize) {
    const result = [];
    for (let i = 0; i < array.length; i += chunkSize) {
        result.push(array.slice(i, i + chunkSize));
    }
    return result;
}


// Bulk insert function for inventory shipment module
async function bulkInsertIntoCosmos(dataArray, containerName) {
    try {
        if (!database) init();

        const container = database.container(containerName);

        // Splitting the data array into chunks of 20 (can be adjusted) since cosmos bulk operation has limit of 100
        const dataChunks = arrayChunks(dataArray, 20);

        for (const chunk of dataChunks) {
            const operations = chunk.map((item) => ({
                operationType: "Upsert",
                resourceBody: item,
            }));

            let success = false;
            while (!success) {
                try {
                    const response = await container.items.bulk(operations);

                    const failedItems = response.filter(
                        (res) => res.statusCode === 429
                    );

                    if (failedItems.length > 0) {
                        const retryAfter = 2000;

                        console.log(
                            `429 encountered. Retrying ${failedItems.length} items after ${retryAfter} ms.`
                        );
                        await new Promise((resolve) =>
                            setTimeout(resolve, retryAfter)
                        );
                    } else {
                        success = true; // If no 429 errors, mark success
                        console.log(
                            `Chunk of ${chunk.length} items processed successfully.`
                        );
                    }
                } catch (error) {
                    console.error(`Failed to process chunk. Error: ${error.message}`);
                    throw error;
                }
            }
        }
    } catch (error) {
        throw error;
    }
}

const bulkDeleteParcelsFromCosmos = async (containerName, customer_id, authorized_group, apn) => {
    try {
        if (!database) init();

        const container = database.container(containerName);

        const query = {
            query: "SELECT c.id FROM c WHERE c.customer_id = @customer_id AND c.authorized_groups = @authorized_group AND c.apn = @apn",
            parameters: [
                { name: "@customer_id", value: customer_id },
                { name: "@authorized_group", value: authorized_group },
                { name: "@apn", value: apn },
            ],
        };

        const { resources: itemsToDelete } = await container.items.query(query).fetchAll();

        if (itemsToDelete.length === 0) {
            console.log("No matching items found for deletion.");
            return;
        }

        console.log(`Found ${itemsToDelete.length} items to delete.`);

        // Split itemsToDelete into chunks of 20
        const dataChunks = arrayChunks(itemsToDelete, 20);

        for (const chunk of dataChunks) {
            const operations = chunk.map((item) => ({
                operationType: "Delete",
                id: item.id,
                partitionKey: item.id
            }));

            let success = false;
            while (!success) {
                try {
                    const response = await container.items.bulk(operations);

                    const failedItems = response.filter(
                        (res) => res.statusCode === 429
                    );

                    if (failedItems.length > 0) {
                        const retryAfter = 2000;

                        console.log(
                            `429 encountered. Retrying ${failedItems.length} items after ${retryAfter} ms.`
                        );
                        await new Promise((resolve) =>
                            setTimeout(resolve, retryAfter)
                        );
                    } else {
                        success = true; // If no 429 errors, mark success
                        console.log(
                            `Chunk of ${chunk.length} items processed successfully.`
                        );
                    }
                } catch (error) {
                    console.error(`Failed to process chunk. Error: ${error.message}`);
                    throw error;
                }
            }
        }

        console.log("Bulk delete operation completed.");
    } catch (error) {
        console.log(`Error during bulk deletion: ${error.message}`);
        throw error;
    }
};

module.exports = {
    init,
    getInstance,
    bulkInsertIntoCosmos,
    bulkDeleteParcelsFromCosmos
}
