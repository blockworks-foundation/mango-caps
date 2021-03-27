import {
  Account,
  Connection,
  PublicKey,
  SystemProgram,
  Transaction,
  TransactionInstruction,
} from "@solana/web3.js";

const notify = console.log;

const getErrorForTransaction = async (connection: Connection, txid: string) => {
  // wait for all confirmation before geting transaction
  await connection.confirmTransaction(txid, "max");

  const tx = await connection.getParsedConfirmedTransaction(txid);

  const errors: string[] = [];
  if (tx?.meta && tx.meta.logMessages) {
    tx.meta.logMessages.forEach((log) => {
      const regex = /Error: (.*)/gm;
      let m;
      while ((m = regex.exec(log)) !== null) {
        // This is necessary to avoid infinite loops with zero-width matches
        if (m.index === regex.lastIndex) {
          regex.lastIndex++;
        }

        if (m.length > 1) {
          errors.push(m[1]);
        }
      }
    });
  }

  return errors;
};

export const sendTransaction = async (
  connection: Connection,
  wallet: any,
  instructions: TransactionInstruction[],
  signers: Account[],
  awaitConfirmation = true
) => {
  let transaction = new Transaction();
  instructions.forEach((instruction) => transaction.add(instruction));
  transaction.recentBlockhash = (
    await connection.getRecentBlockhash("max")
  ).blockhash;
  transaction.setSigners(
    // fee payied by the wallet owner
    wallet.publicKey,
    ...signers.map((s) => s.publicKey)
  );
  if (signers.length > 0) {
    transaction.partialSign(...signers);
  }
  transaction = await wallet.signTransaction(transaction);
  const rawTransaction = transaction.serialize();
  let options = {
    skipPreflight: true,
    commitment: "singleGossip",
  };

  const txid = await connection.sendRawTransaction(rawTransaction, options);

  if (awaitConfirmation) {
    const status = (
      await connection.confirmTransaction(
        txid,
        options && (options.commitment as any)
      )
    ).value;

    if (status?.err) {
      const errors = await getErrorForTransaction(connection, txid);
      notify({
        message: "Transaction failed...",
        description: (
          <>
            {errors.map((err) => (
              <div>{err}</div>
            ))}
            {txid}
          </>
        ),
        type: "error",
      });

      throw new Error(
        `Raw transaction ${txid} failed (${JSON.stringify(status)})`
      );
    }
  }

  return txid;
};
