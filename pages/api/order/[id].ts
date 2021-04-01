import prisma from '../../../lib/prisma'

import { Connection } from '@solana/web3.js';
import { CFG } from '../../../providers/connection'

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// PUT /api/order/:id
// Required fields in body: txHash
export default async function handle(req, res) {
  const orderId = req.query.id;
  const { txHash } = req.body;

  const url = CFG['devnet'].url;
  const web3 = new Connection(url, 'processed');
  const start = Date.now();
  while (true) {
    const response = await web3.getSignatureStatus(txHash);
    if (response.value?.confirmations === null) {
      break;
    }
    //console.log('fetch tx status', [txHash, response.value]);
  }

  const tx = await web3.getConfirmedTransaction(txHash);
  console.log(tx);

  const order = await prisma.orders.update({
    where: { id: Number(orderId) },
    data: { txHash },
  });
  res.json(order);
}
