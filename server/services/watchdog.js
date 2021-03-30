const dbclient = require("./db");
const { databaseId, userContainer } = require("./config");
const database = dbclient.database(databaseId).container(userContainer);
const containerService = require("./containerService");
const mcu = require('minecraft-server-util');
const cutils = require('../utils/containerUtils');


const cyclesTillStop = 5;
const cycleDuration = 60000;

async function containerWatchdog() {
    console.log("running watchdog");
    let inactivityCounter = new Map();
    setInterval(() => {

        database.items
            .query("SELECT c.name from c")
            .fetchAll()
            .then((usernames) => {
                usernames.resources.forEach(element => {
                    containerService.getContainer(element.name).then((foundContainer) => {
                        console.log(`${element.name}: ${foundContainer.instanceView.state}`)
                        if (foundContainer.instanceView.state == 'Running') {
                            mcu.status(foundContainer.ipAddress.fqdn).then((result) => {
                                //console.log(result);
                                if (result.onlinePlayers == 0) {
                                    if (inactivityCounter.has(element.name)) {
                                        inactivityCounter.set(element.name, { cyclesWithZeroPlayers: inactivityCounter.get(element.name).cyclesWithZeroPlayers + 1 });
                                    }
                                    else {
                                        inactivityCounter.set(element.name, {
                                            cyclesWithZeroPlayers: 1
                                        })
                                    }
                                    if (inactivityCounter.get(element.name).cyclesWithZeroPlayers > cyclesTillStop) {
                                        containerService.stopContainer(element.name);
                                        inactivityCounter.delete(element.name);
                                    }
                                    console.log(inactivityCounter.get(element.name));
                                }
                                else {
                                    inactivityCounter.delete(element.name);
                                }
                            }, (err) => {
                                console.log("error getting status for " + element.name)
                                inactivityCounter.delete(element.name);
                            })
                        }
                    }, (err) => {
                        console.log("error getting Container info on " + element.name)
                    })
                });
            }, (err) => { console.log(err); })
    }, cycleDuration)
}

async function autoRefreshInfoLog() {
    console.log("running watchdog");
    let inactivityCounter = new Map();
    setInterval(() => {
        cutils.getStatus("promising-bee").then((status) => {
            console.log(status);
        })
    }, 10000)
}



module.exports = {
    containerWatchdog, autoRefreshInfoLog
}

