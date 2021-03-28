const dbclient = require("./db");
const { databaseId, userContainer } = require("./config");
const database = dbclient.database(databaseId).container(userContainer);
const containerService = require("./container");
const mcu = require('minecraft-server-util');


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
                    containerService.checkContainer(element.name).then((foundContainer) => {
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
    }, 10000)
}

async function autoRefreshInfoLog() {
    console.log("running watchdog");
    let inactivityCounter = new Map();
    setInterval(() => {

        database.items
            .query("SELECT c.name from c")
            .fetchAll()
            .then((usernames) => {
                usernames.resources.forEach(element => {
                    containerService.getContainerUptime(element.name).then((foundContainer) => {
                        //console.log(foundContainer.containers[0].instanceView.currentState)
                        let current = new Date(foundContainer.containers[0].instanceView.currentState.finishTime);
                        let previous = new Date(foundContainer.containers[0].instanceView.previousState.startTime);
                        let differenceInMs = current - previous;
                    }, (err) => {
                        //console.log("error getting Container info on " + element.name)
                    })
                });
            }, (err) => { console.log(err); })
    }, 5000)
}

module.exports = {
    containerWatchdog, autoRefreshInfoLog
}

