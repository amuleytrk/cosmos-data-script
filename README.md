# Utility scripts

## Current available scripts:
```
1. Insert bulk data in to Cosmos Parcels contianer
2. Delete bulk data from Cosmos Parcels container
```


## Installation

- Clone the GitHub branch locally
```
git clone https://github.com/amuleytrk/utility-scripts.git
```

- Install npm dependencies (ensure you have NodeJS and npm installed)
```
npm install
```

- Create the variables.env file
```
Directory for env file: src/env/variables.env
```

- Start the node server locally
```
npm run start
```


## APIs

### Bulk insert into Cosmos Parcels container
- Ensure you update the headers and data in API as needed
```
curl --location 'http://localhost:7093/insert/cosmos/parcels' \
--header 'customer_id: delta' \
--header 'authorized_groups: cargo' \
--header 'Content-Type: application/json' \
--data '{
    "count": 100,
    "tape_type": "White",
    "classification": "Parcel"
}'
```

### Bulk delete from Cosmos Parcels container
- Ensure you update the headers
```
curl --location --request POST 'http://localhost:7093/delete/cosmos/parcels' \
--header 'customer_id: delta' \
--header 'authorized_groups: cargo' \
--data ''
```
