import { Connection } from "@solana/web3.js";
import prisma from "../../../lib/prisma";
import { MEMO_ID } from "../../../lib/pool";
import { CFG } from "../../../providers/connection";
import { u64 } from "@solana/spl-token";

// PUT /api/order/:id
// Required fields in body: txHash
export default async function handle(req, res) {
  const orderId = req.query.id;
  const { txHash, amount } = req.body;

  const { url, tokenProgramId, capMint, capVault } = CFG[CFG.default];
  const web3 = new Connection(url, "recent");
  const start = Date.now();
  while (Date.now() - start < 300 * 1000) {
    const response = await web3.getSignatureStatus(txHash);
    if (response.value?.confirmations === null) {
      break;
    }
  }

  const tx = await web3.getConfirmedTransaction(txHash);
  const txIns = tx.transaction.instructions;

  const transferIns = txIns.find(
    (i) =>
      i.programId.toBase58() == tokenProgramId &&
      i.data[0] == 3 &&
      i.keys[1].pubkey.toBase58() === capVault
  );
  const memoIns = txIns.find(
    (i) => i.programId.toBase58() == MEMO_ID.toBase58()
  );

  if (!transferIns || !memoIns) {
    console.log({ txHash, transferIns, memoIns });
    res.status(500).send("GTFO🖕");
    return;
  }
  const tokenAmount = u64.fromBuffer(transferIns.data.slice(1, 9)).toNumber();
  const amountMatches = tokenAmount == amount;
  const memoText = memoIns.data.toString("utf-8");
  const memoMatches = memoText === `🥭🧢#${orderId}`;

  if (!amountMatches || !memoMatches) {
    console.log({
      txHash,
      amount,
      tokenAmount,
      orderId,
      memoText,
      amountMatches,
      memoMatches,
    });
    res.status(500).send("GTFO🖕");
    return;
  }

  const order = await prisma.orders.update({
    where: { id: Number(orderId) },
    data: { txHash, amount },
  });
  res.json(order);
}
