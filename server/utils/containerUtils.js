const containerService = require('../services/containerService')
const mcu = require('minecraft-server-util');

function getStatus(username) {

    let serviceStatus = {
        containerStatus: {
            available: false,
            status: {}
        },
        serverStatus: {
            available: false,
            status: {}
        }
    }
    return containerService.getContainer(username).then((container) => {
        serviceStatus.containerStatus.available = true;
        serviceStatus.containerStatus.status = container;
        return serviceStatus
    }).then((status) => {
        return mcu.status(status.containerStatus.status.ipAddress.fqdn);
    }).then((status) => {
        serviceStatus.serverStatus.status = status;
        serviceStatus.serverStatus.available = status.version != null && serviceStatus.containerStatus.status.instanceView.state == 'Running';
        return serviceStatus;
    }
    ).catch((err) => {
        //console.log(err);
        return serviceStatus;
    })

}

function getLastRuntime(username) {
    return new Promise(resolve => setTimeout(resolve, 15000)).then(() => {
        return containerService.getContainer(username).then((foundContainer) => {
            // console.log(foundContainer.containers[0].instanceView)
            // console.log(foundContainer.containers[0].instanceView.currentState)
            // console.log(foundContainer.containers[0].instanceView.previousState)
            let current = new Date(foundContainer.containers[0].instanceView.currentState.finishTime);
            let previous = new Date(foundContainer.containers[0].instanceView.previousState.startTime);
            let differenceInMs = current - previous;
            return differenceInMs;

        }, (err) => {
            console.log("error getting Container info on " + element.name)
        })
    });
}

module.exports = { getStatus, getLastRuntime };
