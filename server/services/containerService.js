const MsRestNodeAuth = require("@azure/ms-rest-nodeauth");
const ContainerInstanceManagementClient = require("@azure/arm-containerinstance").ContainerInstanceManagementClient;
const resourceGroupName = "cloudboysResourceGroup";
var containerClient = null;

(function azureLogin() {
  MsRestNodeAuth.loginWithServicePrincipalSecretWithAuthResponse(
    process.env.AZURE_CLIENT_ID,
    process.env.AZURE_CLIENT_SECRET,
    process.env.AZURE_TENANT_ID
  )
    .then((authres) => {
      console.log("azure principal login successful");
      containerClient = new ContainerInstanceManagementClient(authres.credentials, process.env.AZURE_SUBSCRIPTION_ID);
      if (!containerClient) {
      }
      return new Error("containerClient undefined");
    })
    .catch((error) => console.log(error));
})();

function containerTemplate(username) {
  return {
    location: "germanywestcentral",
    name: username,
    containers: [
      {
        name: username + "-container",
        image: "itzg/minecraft-server",
        environmentVariables: [
          {
            name: "EULA",
            value: "TRUE",
          },
          {
            name: "GAMEMODE",
            value: "survival",
          },
          {
            name: "MEMORY",
            value: "1536M",
          },
        ],
        resources: {
          requests: {
            cpu: 1,
            memoryInGB: 2,
          },
        },
        ports: [
          {
            port: 25565,
          },
          {
            protocol: "UDP",
            port: 19132,
          },
        ],
        volumeMounts: [
          {
            mountPath: "/data",
            name: "data",
            readOnly: false,
          },
        ],
      },
    ],
    osType: "Linux",
    ipAddress: {
      type: "Public",
      ports: [
        {
          protocol: "TCP",
          port: 25565,
        },
        {
          protocol: "UDP",
          port: 19132,
        },
      ],
      dnsNameLabel: username,
    },
    restartPolicy: "OnFailure",
    volumes: [
      {
        name: "data",
        azureFile: {
          readOnly: false,
          shareName: username + "-file-share",
          storageAccountName: process.env.AZURE_STORAGE_ACCOUNT,
          storageAccountKey: process.env.AZURE_STORAGE_KEY,
        },
      },
    ],
  };
}

function createContainer(username) {
  return containerClient.containerGroups.createOrUpdate(
    resourceGroupName,
    username + "-container-group",
    containerTemplate(username)
  );
}

function startContainer(username) {
  return containerClient.containerGroups.start(resourceGroupName, username + "-container-group");
}

function stopContainer(username) {
  return containerClient.containerGroups.stop(resourceGroupName, username + "-container-group");
}

function deleteContainer(username) {
  return containerClient.containerGroups.deleteMethod(resourceGroupName, username + "-container-group");
}

function getContainer(username) {
  return containerClient.containerGroups.get(resourceGroupName, username + "-container-group");
}

module.exports = { createContainer, startContainer, stopContainer, deleteContainer, getContainer };
