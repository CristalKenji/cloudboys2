const { ShareServiceClient, StorageSharedKeyCredential } = require("@azure/storage-file-share");
const credential = new StorageSharedKeyCredential(process.env.AZURE_STORAGE_ACCOUNT, process.env.AZURE_STORAGE_KEY);
const serviceClient = new ShareServiceClient(
  `https://${process.env.AZURE_STORAGE_ACCOUNT}.file.core.windows.net`,
  credential
);

function createFileShare(username) {
  const shareCreateOptions = {
    accessTier: "Hot",
    protocols: "SMB",
    quota: 1,
  };
  return serviceClient.getShareClient(username + "-file-share").createIfNotExists(shareCreateOptions);
}

function deleteFileShare(username) {
  return serviceClient.getShareClient(username + "-file-share").deleteIfExists();
}

module.exports = { createFileShare, deleteFileShare };
