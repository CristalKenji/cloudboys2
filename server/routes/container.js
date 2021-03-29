const express = require("express");
const router = express.Router();
var containerService = require("../services/containerService");
var userService = require("../services/user");
const utils = require("../utils/utils");
const mcu = require("minecraft-server-util");
const cutils = require("../utils/containerUtils")

router.post("/", (req, res) => {
    let username = utils.generateUserName();
    console.log(username);
    userService
        .createNewUser(username)
        .then(() => {
            return containerService.createContainer(username);
        })
        .then(() => {
            res.status(200).send(username);
        })
        .catch((error) => {
            res.status(500).send(error);
        });
});

router.delete("/", (req, res) => {
    if (userService.loginUser(req.body.username)) {
        console.log("deleting " + req.body.username);
        containerService.deleteContainer(req.body.username);
        res.status(200).send();
    }
    res.status(404).send();
});

router.post("/start", (req, res) => {
    const username = req.body.username;
    console.log("start container for user " + username);
    if (typeof username !== "undefined" && username !== "") {
        containerService
            .startContainer(username)
            .then((result) => {
                console.log(result);
                res.status(200).json(result);
            })
            .catch((error) => {
                res.status(error).send(error.code);
            });
    } else {
        console.log("username undefined");
    }
});

router.post("/stop", (req, res) => {
    containerService
        .stopContainer(req.body.username)
        .then((result) => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(error).send(error.code);
        }).finally(() => {
            cutils.getLastRuntime(req.body.username).then((ayy) => {
                userService.updateRuntime(req.body.username, ayy)
            })
        })

});

router.post("/state", (req, res) => {
    containerService
        .checkContainer(req.body.username)
        .then((info) => {
            //console.log(info);
            res.status(200).json(info.instanceView.state);
        })
        .catch((error) => {
            res.status(error.statusCode).send(error.code);
        });
});


module.exports = router;
