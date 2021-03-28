const config = {
  endpoint: process.env.COSMOS_PROD_ENDPOINT,
  key: process.env.COSMOS_PROD_PRIMARY_KEY,
  databaseId: process.env.COSMOS_EMULATOR_DB,
  userContainer: process.env.COSMOS_EMULATOR_USERCONTAINER,
  partitionKey: { kind: "Hash", paths: ["/category"] },
};

module.exports = config;
