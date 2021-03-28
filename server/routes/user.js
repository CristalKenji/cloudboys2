const express = require("express");
const services = require("../services"); //??
const main = require("../utils/utils");

const router = express.Router();
const { userService } = services;

// single user page
router.get("/:name", (req, res) => {
  res.status(200).send("grüße vom backend");
});

// all user page "admin page"

router.get("/users", (req, res) => {
  userService
    .getUserNames()
    .then((result) => {
      res.render("pages/users", { users: result.resources });
    })
    .catch((error) => {
      console.log(error);
      res.render("pages/users", { users: "" });
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
  userService.createNewUser();
  //res.status(200).send("grüße vom backend");
  res.redirect("user/users");
});

router.delete("/users/", (req, res) => {
  //console.log("delete request for user " + req.body.username);
  userService.deleteUser(req.body.username).then((result) => {
    console.log("router delteUserStatus " + result);
    res.status(200).send("user deleted");
  });
});

module.exports = router;
