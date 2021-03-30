const client = require("./db");
const { databaseId, userContainer } = require("./config");
const utils = require("../utils/utils");
const fileStorage = require("./fileStorage");
const containerClient = require("./containerService");
const { ConflictResolutionMode } = require("@azure/cosmos");
//const { resolveInclude } = require("ejs");
const containerUtils = require("../utils/containerUtils");

const database = client.database(databaseId).container(userContainer);

function extendedStatus(username) {
  return new Promise((resolve, reject) => {
    containerUtils
      .getStatus(username)
      .then((result) => {
        if (result.containerStatus.available && result.serverStatus.available) {
          //const details = [];
          const details = { port: "", version: "", onlinePlayers: "", maxPlayers: "", description: "" };
          details.port = result.serverStatus.status.port;
          details.version = result.serverStatus.status.version;
          details.onlinePlayers = result.serverStatus.status.onlinePlayers;
          details.maxPlayers = result.serverStatus.status.maxPlayers;
          details.description = result.serverStatus.status.description.descriptionText;
          resolve(details);
        } else {
          resolve("");
        }
      })
      .catch((error) => {
        //console.log(error);
        reject(error);
      });
  });
}

async function getAllInfos() {
  try {
    let users = [];
    const result = await getUserNames();
    const array = result.resources;
    for (let i = 0; i < array.length; i++) {
      const name = array[i].name;
      user = await userInfo(name);
      users.push(user);
    }
    console.log(users);
    return users;
  } catch (error) {
    console.log(error);
  }
}

async function userInfo(username) {
  return new Promise((resolve, reject) => {
    const user = { name: username, state: "", showDetails: false, details: "", dns: "" };
    containerClient
      .getContainer(username)
      .then((result) => {
        //console.log(result);
        const state = result.instanceView.state;
        const dnsLabel = result.ipAddress.dnsNameLabel;
        user.state = state;
        user.dns = dnsLabel;
        resolve(user);
      })
      .catch((error) => {
        //console.log(error.code);
        user.state = error.code;
        user.dns = "...";
        resolve(user);
      });
  });
}

function verifyUserExists(username) {
  //console.log("loginUser");
  return new Promise((resolve, reject) => {
    if (typeof username !== "undefined" && username !== "") {
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
    } else {
      reject("username undefined or empty");
    }
  });
}

async function createNewUser(username) {
  return new Promise((resolve, reject) => {
    if (typeof username !== "undefined" && username !== "") {
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
    } else {
      reject("username undefined or empty");
    }
  });
}

function deleteUser(username) {
  return new Promise((resolve, reject) => {
    const promises = [
      deleteDBEntry(username),
      fileStorage.deleteFileShare(username),
      containerClient.deleteContainer(username),
    ];
    Promise.allSettled(promises)
      .then((results) => {
        results.forEach((result) => {
          //console.log("deleteUser result status");
          console.log(result);
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
  console.log("username " + username);
  return new Promise((resolve, reject) => {
    database.items
      .query("SELECT c.id from c WHERE c.name ='" + username + "'")
      .fetchAll()
      .then((result) => {
        //console.log("result");
        //console.log(result);
        let id = result.resources[0].id;

        //"'" + result.resources[0].id + "'";
        //console.log("id: " + id);
        return database.item(id).delete();
      })
      .then((result) => {
        console.log("deleteDBEntry");
        console.log(result);
        resolve("db entry deleted");
      })
      .catch((error) => {
        console.log(error);
        reject("db entry " + error.body.code);
      });
  });
}

async function getUserNames() {
  //console.log("getUserNames");
  return await database.items.query("SELECT c.name from c").fetchAll();
}

function postUser(username) {
  const user = {
    name: username,
    runtime: 0,
  };
  return database.items.create(user);
}

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
  let user = await getUserByName(username);
  user.resources[0].runtime += additionalRuntime;
  try {
    console.log("updating runtime");
    return await database.items.upsert(user.resources[0]);
  } catch (error) {
    console.log(error.message);
  }

  //const query =
}

module.exports = {
  createNewUser,
  verifyUserExits: verifyUserExists,
  getUserNames,
  deleteUser,
  getAllInfos,
  updateRuntime,
  extendedStatus,
};
