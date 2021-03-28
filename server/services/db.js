const CosmosClient = require("@azure/cosmos").CosmosClient;
const config = require("./config");
const { endpoint, key } = config;

const client = new CosmosClient({ endpoint, key });

async function main() {
  const { database } = await client.databases.createIfNotExists({ id: "db" });
  console.log(database.id);

  const { container } = await database.containers.createIfNotExists({ id: "users" });
  console.log(container.id);

  const cities = [
    { id: "1", name: "hungry-hugo" },
    { id: "2", name: "mighty-mouse" },
    { id: "3", name: "gopnik.goose" },
    { id: "4", name: "snoopy-snake" },
  ];
  /*
  for (const city of cities) {
    container.items.create(city);
  }
*/
  //var myItem = await container.item("1").read();
  //console.log(myItem);
  //await container.item("2").delete();
  //await container.item("4").delete();

  //await container.item("1").delete();
  const { resources } = await container.items.query("SELECT * from c").fetchAll();
  resources.forEach((resources) => {
    console.log(resources.name);
  });
}
/*
main().catch((error) => {
  console.error(error);
});
*/

module.exports = client;
