const express = require("express");
const { util } = require("prettier");
const services = require("../services"); //??
const main = require("../utils/utils");
const containerClient = require("../services/containerService");
const router = express.Router();
const { userService } = services;

router.get("/allInfos", (req, res) => {
  userService
    .getAllInfos()
    .then((result) => {
      console.log(result);
      res.status(200).send(result);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send("grüße vom backend");
    });
});

router.get("/usernames", (req, res) => {
  userService
    .getUserNames()
    .then((result) => {
      res.status(200).send(result.resources);
    })
    .catch((error) => {
      res.status(520).send(error);
    });
});

router.post("/users/", (req, res) => {
  const username = main.generateUserName();
  console.log(username);
  userService
    .createNewUser(username)
    .then(() => {
      //create container
      return containerClient.createContainer(username);
    })
    .then(() => {
      res.status(200).send("container created");
    })
    .catch((error) => {
      console.log(error);
      res.status(500);
    });
});

router.delete("/users/", (req, res) => {
  console.log(req.body);
  let username = req.body.username;
  console.log("delete reeeeequest for user " + username);
  if (typeof username !== "undefined" && username !== "") {
    userService.deleteUser(username).then((result) => {
      console.log("router delteUserStatus " + result);
      res.status(200).send("user deleted");
    });
  } else {
    res.status(300).send("user name undefined");
  }
});

router.post("/login", (req, res) => {
  const username = req.body.username;
  console.log(username);
  userService
    .verifyUserExits(username)
    .then((result) => {
      console.log(result);
      if (result) {
        res.status(200).send(true);
      } else {
        res.status(200).send(false);
      }
    })
    .catch((error) => {
      console.log(error);
      res.status(500).send(error);
    });
});

module.exports = router;
