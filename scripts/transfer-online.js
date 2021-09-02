// Uncomment only if using self-signed certificate node;
// process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0;

const {
  apiHost,
  verifyNode,
  verifyChainId,
  verifySenderAcctOnline,
  verifyReceiverAcctTransferOnline,
  verifyAmountOnline,
  verifySenderPublicKey,
  verifySenderPrivateKey,
  printPreview,
  askContinue,
  printCurlCmd,
  executeCmd,
  askReview,
  exit } = require("../util/verify.js");

const { transfer } = require("../util/create-cmd.js");

const main = async () => {
 let node = 'api.testnet.chainweb.com'
 let chainId= '1'
 let senderAcct='T_jacky'
 let receiverAcct='T_jacky_2'
 let amount = 1
 let senderPublicKey='d9154c50fc602a9d56464e3217abc8286f87e6e6c3faa93e23e4f4ce774ba7e6'
 let senderPrivateKey = '75416ffb2c46177229aa230390e6c2abb3aeaf1466e204f6ffd9f3daca1bd1fd'
 await runOnlineTransfer(node, chainId, senderAcct, receiverAcct, amount, senderPublicKey, senderPrivateKey);
 exit();
}

async function runOnlineTransfer (node, chainId, senderAcct, receiverAcct, amount, senderPublicKey, senderPrivateKey) {
  nodeInfo = await verifyNode(node);
  node = nodeInfo.node;
  networkId = nodeInfo.networkId;
  chainId = await verifyChainId(chainId);
  host = apiHost(node, networkId, chainId)
  senderInfo = await verifySenderAcctOnline(senderAcct, chainId, host);
  senderDetails = senderInfo.details;
  senderAcct = senderInfo.account;
  receiverInfo = await verifyReceiverAcctTransferOnline(receiverAcct, chainId, host)
  receiverAcct = receiverInfo.account;
  amount = await verifyAmountOnline(senderAcct, senderDetails, receiverAcct, amount)
  await askReview(chainId, senderAcct, receiverAcct, amount);
  senderPublicKey =  await verifySenderPublicKey(senderAcct, senderPublicKey);
  senderPrivateKey = await verifySenderPrivateKey(senderAcct, senderPrivateKey);
  await printPreview(transfer.local(senderAcct, senderPublicKey, senderPrivateKey, receiverAcct, amount, chainId), host)
  await askContinue();
  printCurlCmd(transfer.send(senderAcct, senderPublicKey, senderPrivateKey, receiverAcct, amount, chainId, networkId), host);
}

main();
