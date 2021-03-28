const express = require("express");
const router = express.Router();
var containerService = require("../services/container");
var userService = require("../services/user");
const utils = require("../utils/utils");
const mcu = require("minecraft-server-util");

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
    containerService
        .startContainer(req.body.username)
        .then((result) => {
            console.log(result);
            res.status(200).json(result);
        })
        .catch((error) => {
            res.status(error).send(error.code);
        });
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
        });
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

router.get("/", (req, res) => {
    if (userService.loginUser(req.body.username)) {
        containerService.checkContainer(req.body.username).then(
            (info) => {
                console.log(info);
                mcu.status(info.ipAddress.fqdn).then((result) => {
                    res.json(result);
                })
            },
            (err) => {
                res.status(404).send();
            }
        );
    }
    res.status(404).send();
});

router.get("/start", (req, res) => {
    if (userService.loginUser(req.body.username)) {
        containerService.startContainer(req.body.username).then(
            (info) => {
                console.log("started " + req.body.username);
                res.status(200).send();
            },
            (err) => {
                res.status(404).send();
            }
        );
    }
});

router.get("/stop", (req, res) => {
    if (userService.loginUser(req.body.username)) {
        containerService.stopContainer(req.body.username).then(
            (info) => {
                console.log("stopped " + req.body.username);
                res.status(200).send();
            },
            (err) => {
                res.status(404).send(err);
            }
        );
    }
});

module.exports = router;
