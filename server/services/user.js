const client = require("./db");
const { databaseId, userContainer } = require("./config");
const utils = require("../utils/utils");
const fileStorage = require("./fileStorage");
const containerClient = require("./containerService");
//const { resolveInclude } = require("ejs");

const database = client.database(databaseId).container(userContainer);

function loginUser(username) {
  //console.log("loginUser");
  return new Promise((resolve, reject) => {
    database.items
      .query("SELECT c.name from c WHERE c.name ='" + username + "'")
      .fetchAll()
      .then((usernames) => {
        //console.log(usernames);
        resolve(usernames.resources.length == 1);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

async function createNewUser(username) {
  return new Promise((resolve, reject) => {
    //username = utils.generateUserName();
    // verify username is unique
    database.items
      .query("SELECT c.name from c WHERE c.name='" + username + "'")
      .fetchAll()
      .then((usernames) => {
        if (usernames.resources.length != 0) {
          return new Error("username allready taken");
        }
      })
      .then(() => {
        console.log("creating user");
        return postUser(username);
      })
      .then(() => {
        // create file-share
        console.log("creating fileshare");
        return fileStorage.createFileShare(username);
      })
      .then(() => {
        resolve("user db- and file-share account created");
      })
      .catch((error) => {
        reject(error.message);
      });
  });
}

function deleteUser(username) {
  return new Promise((resolve, reject) => {
    const promises = [
      deleteDBEntry(username),
      containerClient.deleteContainer(username),
      fileStorage.deleteFileShare(username),
    ];
    Promise.allSettled(promises)
      .then((results) => {
        results.forEach((result) => {
          //console.log("deleteUser result status");
          //console.log(result.status);
        });
      })
      .catch((errors) => {
        errors.forEach((error) => {
          //console.log("deleteUser error");
          console.log(error);
        });
      });
    resolve("finished");
  });
}

function deleteDBEntry(username) {
  return new Promise((resolve, reject) => {
    database.items
      .query("SELECT c.id from c WHERE c.name ='" + username + "'")
      .fetchAll()
      .then((result) => {
        let id = result.resources[0].id; //"'" + result.resources[0].id + "'";
        //console.log("id: " + id);
        return database.item(id).delete();
      })
      .then((result) => {
        //console.log("deleteDBEntry");
        //console.log(result.statusCode);
        resolve("db entry deleted");
      })
      .catch((error) => {
        //console.log(error.body.code);
        reject("db entry " + error.body.code);
      });
  });
}

/*
async function getUsers() {
  try {
    console.log("getUsers");
    return await container.items.query("SELECT * from c").fetchAll();
  } catch (error) {
    console.log(error.message);
  }
}
*/

async function getUserNames() {
  //console.log("getUserNames");
  return await database.items.query("SELECT c.name from c").fetchAll();
}

function postUser(username) {
  const user = {
    name: username,
    runtime: 0
  };
  return database.items.create(user);
}
/*
async function deleteUser(id) {
  try {
    console.log(`Deleted item with id: ${id}`);
    return await database.item(id).delete();
  } catch (error) {
    console.log(error.message);
  }
}
*/
async function deleteUserContainer() {
  try {
    console.log(`Deleted user container`);
    return await database.delete();
  } catch (error) {
    console.log(error.message);
  }
}

async function getUserByName(username) {
  //console.log("get user by name: " + username);
  const query = "SELECT * FROM c where c.name = '" + username + "'";
  //console.log(query);
  try {
    console.log("get user by name");
    return await database.items.query(query).fetchAll();
  } catch (error) {
    console.log(error.message);
  }
}

async function updateRuntime(username, additionalRuntime) {
  currentTime = await getUserByName(username).runtime;
  //const query = 
}

module.exports = {
  createNewUser,
  loginUser,
  getUserNames,
  deleteUser,
};
