import { Connection } from '@solana/web3.js'
import prisma from '../../../lib/prisma'
import { MEMO_ID } from '../../../lib/pool'
import { CFG } from '../../../providers/connection'

const sleep = (milliseconds) => {
  return new Promise(resolve => setTimeout(resolve, milliseconds))
}

// PUT /api/order/:id
// Required fields in body: txHash
export default async function handle(req, res) {
  const orderId = req.query.id;
  const { txHash } = req.body;

  const { url, tokenProgramId, capMint }  = CFG[CFG.default];
  const web3 = new Connection(url, 'processed');
  const start = Date.now();
  while (Date.now() - start < 100*1000) {
    const response = await web3.getSignatureStatus(txHash);
    if (response.value?.confirmations === null) {
      break;
    }
  }

  const tx = await web3.getConfirmedTransaction(txHash);
  const txIns = tx.transaction.instructions;

  const burnIns = txIns.find(i => i.programId.toBase58() == tokenProgramId &&
                                  i.data.equals(Buffer.from([8,1,0,0,0,0,0,0,0])) &&
                                  i.keys[1].pubkey.toBase58() == capMint);

  const memoIns = txIns.find(i => i.programId.toBase58() == MEMO_ID.toBase58());
  const memoText = memoIns.data.toString('utf-8');
  const memoMatches = memoText === `🥭🧢#${orderId}`;

  if (!burnIns || !memoMatches) {
    console.log({txHash, memoText, memoIns, burnIns});
    res.status(500).send('GTFO🖕');
  }

  const order = await prisma.orders.update({
    where: { id: Number(orderId) },
    data: { txHash },
  });
  res.json(order);
}
