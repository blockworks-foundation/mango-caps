import assert from 'assert';
import BN from 'bn.js';
import * as BufferLayout from "buffer-layout";
import {
  Account, AccountInfo,
  Connection,
  PublicKey,
  SystemProgram, Transaction,
  TransactionInstruction,
} from "@solana/web3.js";
import {
  AccountInfo as TokenAccountInfo,
  AccountLayout,
  MintLayout,
  Token,
} from "@solana/spl-token";
import { TokenSwap } from "@solana/spl-token-swap";

import { sendTransaction } from "./transaction";

/**
 * Some amount of tokens
 */
export class Numberu64 extends BN {


  constructor(
    number: number | string | number[] | ReadonlyArray<number> | Buffer,
    base?: number) {
    super(number, base);
  }

  /**
   * Convert to Buffer representation
   */
  toBuffer(): Buffer {
    const a = super.toArray().reverse();
    const b = Buffer.from(a);
    if (b.length === 8) {
      return b;
    }
    assert(b.length < 8, 'Numberu64 too large');

    const zeroPad = Buffer.alloc(8);
    b.copy(zeroPad);
    return zeroPad;
  }

  /**
   * Construct a Numberu64 from Buffer representation
   */
  static fromBuffer(buffer: Buffer): Numberu64 {
    assert(buffer.length === 8, `Invalid buffer length: ${buffer.length}`);
    return new Numberu64(
      [...buffer]
        .reverse()
        .map(i => `00${i.toString(16)}`.slice(-2))
        .join(''),
      16,
    );
  }
}

/**
 * Layout for a public key
 */
export const publicKey = (property: string = "publicKey"): Object => {
  return BufferLayout.blob(32, property);
};

/**
 * Layout for a 64bit unsigned value
 */
export const uint64 = (property: string = "uint64"): Object => {
  return BufferLayout.blob(8, property);
}

export const TokenSwapLayoutLegacyV0 = BufferLayout.struct([
  BufferLayout.u8("isInitialized"),
  BufferLayout.u8("nonce"),
  publicKey("tokenAccountA"),
  publicKey("tokenAccountB"),
  publicKey("tokenPool"),
  uint64("feesNumerator"),
  uint64("feesDenominator"),
]);

export const TokenSwapLayout: typeof BufferLayout.Structure = BufferLayout.struct(
  [
    BufferLayout.u8("isInitialized"),
    BufferLayout.u8("nonce"),
    publicKey("tokenProgramId"),
    publicKey("tokenAccountA"),
    publicKey("tokenAccountB"),
    publicKey("tokenPool"),
    publicKey("mintA"),
    publicKey("mintB"),
    publicKey("feeAccount"),
    BufferLayout.u8("curveType"),
    uint64("tradeFeeNumerator"),
    uint64("tradeFeeDenominator"),
    uint64("ownerTradeFeeNumerator"),
    uint64("ownerTradeFeeDenominator"),
    uint64("ownerWithdrawFeeNumerator"),
    uint64("ownerWithdrawFeeDenominator"),
    BufferLayout.blob(16, "padding"),
  ]
);

export const createInitSwapInstruction = (
  tokenSwapAccount: Account,
  authority: PublicKey,
  tokenAccountA: PublicKey,
  tokenAccountB: PublicKey,
  tokenPool: PublicKey,
  feeAccount: PublicKey,
  tokenAccountPool: PublicKey,
  tokenProgramId: PublicKey,
  swapProgramId: PublicKey,
  nonce: number,
  curveType: number,
  tradeFeeNumerator: number,
  tradeFeeDenominator: number,
  ownerTradeFeeNumerator: number,
  ownerTradeFeeDenominator: number,
  ownerWithdrawFeeNumerator: number,
  ownerWithdrawFeeDenominator: number
): TransactionInstruction => {
  const keys = [
    { pubkey: tokenSwapAccount.publicKey, isSigner: false, isWritable: true },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: tokenAccountA, isSigner: false, isWritable: false },
    { pubkey: tokenAccountB, isSigner: false, isWritable: false },
    { pubkey: tokenPool, isSigner: false, isWritable: true },
    { pubkey: feeAccount, isSigner: false, isWritable: false },
    { pubkey: tokenAccountPool, isSigner: false, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
  ];

  const commandDataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    BufferLayout.u8("nonce"),
    BufferLayout.u8("curveType"),
    BufferLayout.nu64("tradeFeeNumerator"),
    BufferLayout.nu64("tradeFeeDenominator"),
    BufferLayout.nu64("ownerTradeFeeNumerator"),
    BufferLayout.nu64("ownerTradeFeeDenominator"),
    BufferLayout.nu64("ownerWithdrawFeeNumerator"),
    BufferLayout.nu64("ownerWithdrawFeeDenominator"),
    BufferLayout.blob(16, "padding"),
  ]);
  let data = Buffer.alloc(1024);
  {
    const encodeLength = commandDataLayout.encode(
      {
        instruction: 0, // InitializeSwap instruction
        nonce,
        curveType,
        tradeFeeNumerator,
        tradeFeeDenominator,
        ownerTradeFeeNumerator,
        ownerTradeFeeDenominator,
        ownerWithdrawFeeNumerator,
        ownerWithdrawFeeDenominator,
      },
      data
    );
    data = data.slice(0, encodeLength);
  }
  return new TransactionInstruction({
    keys,
    programId: swapProgramId,
    data,
  });
};

export const depositInstruction = (
  tokenSwap: PublicKey,
  authority: PublicKey,
  sourceA: PublicKey,
  sourceB: PublicKey,
  intoA: PublicKey,
  intoB: PublicKey,
  poolToken: PublicKey,
  poolAccount: PublicKey,
  swapProgramId: PublicKey,
  tokenProgramId: PublicKey,
  poolTokenAmount: number,
  maximumTokenA: number,
  maximumTokenB: number
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    uint64("poolTokenAmount"),
    uint64("maximumTokenA"),
    uint64("maximumTokenB"),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 2, // Deposit instruction
      poolTokenAmount: new Numberu64(poolTokenAmount).toBuffer(),
      maximumTokenA: new Numberu64(maximumTokenA).toBuffer(),
      maximumTokenB: new Numberu64(maximumTokenB).toBuffer(),
    },
    data
  );

  const keys = [
    { pubkey: tokenSwap, isSigner: false, isWritable: false },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: sourceA, isSigner: false, isWritable: true },
    { pubkey: sourceB, isSigner: false, isWritable: true },
    { pubkey: intoA, isSigner: false, isWritable: true },
    { pubkey: intoB, isSigner: false, isWritable: true },
    { pubkey: poolToken, isSigner: false, isWritable: true },
    { pubkey: poolAccount, isSigner: false, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
  ];
  return new TransactionInstruction({
    keys,
    programId: swapProgramId,
    data,
  });
};

export const withdrawInstruction = (
  tokenSwap: PublicKey,
  authority: PublicKey,
  poolMint: PublicKey,
  feeAccount: PublicKey | undefined,
  sourcePoolAccount: PublicKey,
  fromA: PublicKey,
  fromB: PublicKey,
  userAccountA: PublicKey,
  userAccountB: PublicKey,
  swapProgramId: PublicKey,
  tokenProgramId: PublicKey,
  poolTokenAmount: number,
  minimumTokenA: number,
  minimumTokenB: number,
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    uint64("poolTokenAmount"),
    uint64("minimumTokenA"),
    uint64("minimumTokenB"),
  ]);

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 3, // Withdraw instruction
      poolTokenAmount: new Numberu64(poolTokenAmount).toBuffer(),
      minimumTokenA: new Numberu64(minimumTokenA).toBuffer(),
      minimumTokenB: new Numberu64(minimumTokenB).toBuffer(),
    },
    data
  );

  const keys = [
    { pubkey: tokenSwap, isSigner: false, isWritable: false },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: poolMint, isSigner: false, isWritable: true },
    { pubkey: sourcePoolAccount, isSigner: false, isWritable: true },
    { pubkey: fromA, isSigner: false, isWritable: true },
    { pubkey: fromB, isSigner: false, isWritable: true },
    { pubkey: userAccountA, isSigner: false, isWritable: true },
    { pubkey: userAccountB, isSigner: false, isWritable: true },
  ];

  if (feeAccount) {
    keys.push({ pubkey: feeAccount, isSigner: false, isWritable: true });
  }
  keys.push({ pubkey: tokenProgramId, isSigner: false, isWritable: false });

  return new TransactionInstruction({
    keys,
    programId: swapProgramId,
    data,
  });
};

export const swapInstruction = (
  tokenSwap: PublicKey,
  authority: PublicKey,
  userSource: PublicKey,
  poolSource: PublicKey,
  poolDestination: PublicKey,
  userDestination: PublicKey,
  poolMint: PublicKey,
  feeAccount: PublicKey,
  swapProgramId: PublicKey,
  tokenProgramId: PublicKey,
  amountIn: number,
  minimumAmountOut: number,
  programOwner?: PublicKey
): TransactionInstruction => {
  const dataLayout = BufferLayout.struct([
    BufferLayout.u8("instruction"),
    uint64("amountIn"),
    uint64("minimumAmountOut"),
  ]);

  const keys = [
    { pubkey: tokenSwap, isSigner: false, isWritable: false },
    { pubkey: authority, isSigner: false, isWritable: false },
    { pubkey: userSource, isSigner: false, isWritable: true },
    { pubkey: poolSource, isSigner: false, isWritable: true },
    { pubkey: poolDestination, isSigner: false, isWritable: true },
    { pubkey: userDestination, isSigner: false, isWritable: true },
    { pubkey: poolMint, isSigner: false, isWritable: true },
    { pubkey: feeAccount, isSigner: false, isWritable: true },
    { pubkey: tokenProgramId, isSigner: false, isWritable: false },
  ];

  // optional depending on the build of token-swap program
  if (programOwner) {
    keys.push({ pubkey: programOwner, isSigner: false, isWritable: true });
  }

  const data = Buffer.alloc(dataLayout.span);
  dataLayout.encode(
    {
      instruction: 1, // Swap instruction
      amountIn: new Numberu64(amountIn).toBuffer(),
      minimumAmountOut: new Numberu64(minimumAmountOut).toBuffer(),
    },
    data
  );

  return new TransactionInstruction({
    keys,
    programId: swapProgramId,
    data,
  });
};



export interface TokenAccount {
  pubkey: PublicKey;
  account?: AccountInfo<Buffer>;
  info?: TokenAccountInfo;
}

export interface PoolInfo {
  pubkeys: {
    program: PublicKey;
    account: PublicKey;
    holdingAccounts: PublicKey[];
    holdingMints: PublicKey[];
    mint: PublicKey;
    feeAccount?: PublicKey;
  };
  legacy: boolean;
  raw: any;
}

export interface LiquidityComponent {
  amount: number;
  account?: TokenAccount;
  mintAddress: string;
}

export interface PoolConfig {
  curveType: 0 | 1 | 2 | 3;
  tradeFeeNumerator: number;
  tradeFeeDenominator: number;
  ownerTradeFeeNumerator: number;
  ownerTradeFeeDenominator: number;
  ownerWithdrawFeeNumerator: number;
  ownerWithdrawFeeDenominator: number;
}

export interface ProgramIDs {
  token: PublicKey;
  swap: PublicKey;
}

const LIQUIDITY_TOKEN_PRECISION = 8;

const notify = console.log;

export async function addLiquidity(
  wallet: any,
  connection: Connection,
  components: LiquidityComponent[],
  options: PoolConfig,
  programIds: ProgramIDs,
) {
  notify({
    message: "Creating new pool...",
    description: "Please review transactions to approve.",
    type: "warn",
  });

  if (components.some((c) => !c.account)) {
    notify({
      message: "You need to have balance for all legs in the basket...",
      description: "Please review inputs.",
      type: "error",
    });
    return;
  }

  let instructions: TransactionInstruction[] = [];
  let cleanupInstructions: TransactionInstruction[] = [];

  const liquidityTokenAccount = new Account();
  // Create account for pool liquidity token
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: liquidityTokenAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        MintLayout.span
      ),
      space: MintLayout.span,
      programId: new PublicKey(programIds.token),
    })
  );

  const tokenSwapAccount = new Account();
  console.log('token swap program id', programIds.swap.toString());
  const [authority, nonce] = await PublicKey.findProgramAddress(
    [tokenSwapAccount.publicKey.toBuffer()],
    programIds.swap
  );
  console.log('authority', authority.toString());

  // create mint for pool liquidity token
  instructions.push(
    Token.createInitMintInstruction(
      programIds.token,
      liquidityTokenAccount.publicKey,
      LIQUIDITY_TOKEN_PRECISION,
      // pass control of liquidity mint to swap program
      authority,
      // swap program can freeze liquidity token mint
      null
    )
  );

  // Create holding accounts for
  const accountRentExempt = await connection.getMinimumBalanceForRentExemption(
    AccountLayout.span
  );
  const holdingAccounts: Account[] = [];
  let signers: Account[] = [];

  components.forEach((leg) => {
    if (!leg.account) {
      return;
    }

    const mintPublicKey = leg.account.info.mint;
    // component account to store tokens I of N in liquidity poll
    holdingAccounts.push(
      createSplAccount(
        instructions,
        wallet.publicKey,
        accountRentExempt,
        mintPublicKey,
        authority,
        AccountLayout.span,
        programIds.token
      )
    );
  });

  // creating depositor pool account
  const depositorAccount = createSplAccount(
    instructions,
    wallet.publicKey,
    accountRentExempt,
    liquidityTokenAccount.publicKey,
    wallet.publicKey,
    AccountLayout.span,
    programIds.token
  );

  // creating fee pool account its set from env variable or to creater of the pool
  // creater of the pool is not allowed in some versions of token-swap program
  const feeAccount = createSplAccount(
    instructions,
    wallet.publicKey,
    accountRentExempt,
    liquidityTokenAccount.publicKey,
    wallet.publicKey,
    AccountLayout.span,
    programIds.token
  );

  // create all accounts in one transaction
  signers = [
    liquidityTokenAccount,
    depositorAccount,
    feeAccount,
    ...holdingAccounts,
    ...signers,
  ]

  let transaction = new Transaction()
  instructions.concat(cleanupInstructions).forEach(
    (i) => (transaction.add(i))
  )

  let instrStr = 'create pool transaction'
  let tx: string = await sendTransaction({
    transaction,
    wallet,
    signers,
    connection,
    sendingMessage: `sending ${instrStr}...`,
    sentMessage: `${instrStr} sent`,
    successMessage: `${instrStr} success`
  });
  notify({
    message: "Accounts created",
    description: `Transaction ${tx}`,
    type: "success",
  });

  notify({
    message: "Adding Liquidity...",
    description: "Please review transactions to approve.",
    type: "warn",
  });

  signers = [];
  instructions = [];
  cleanupInstructions = [];

  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: wallet.publicKey,
      newAccountPubkey: tokenSwapAccount.publicKey,
      lamports: await connection.getMinimumBalanceForRentExemption(
        TokenSwapLayout.span
      ),
      space: TokenSwapLayout.span,
      programId: programIds.swap,
    })
  );

  instructions.push(
    createInitSwapInstruction(
      tokenSwapAccount,
      authority,
      holdingAccounts[0].publicKey,
      holdingAccounts[1].publicKey,
      liquidityTokenAccount.publicKey,
      feeAccount.publicKey,
      depositorAccount.publicKey,
      programIds.token,
      programIds.swap,
      nonce,
      options.curveType,
      options.tradeFeeNumerator,
      options.tradeFeeDenominator,
      options.ownerTradeFeeNumerator,
      options.ownerTradeFeeDenominator,
      options.ownerWithdrawFeeNumerator,
      options.ownerWithdrawFeeDenominator
    )
  );

  // All instructions didn't fit in single transaction
  // initialize and provide inital liquidity to swap in 2nd (this prevents loss of funds)
  signers = [tokenSwapAccount, ...signers]
  transaction = new Transaction()
  instructions.concat(cleanupInstructions).forEach(
    (i) => (transaction.add(i))
  )

  instrStr = 'add liquidity transaction'
  tx = await sendTransaction({
    transaction,
    wallet,
    signers,
    connection,
    sendingMessage: `sending ${instrStr}...`,
    sentMessage: `${instrStr} sent`,
    successMessage: `${instrStr} success`
  });

  notify({
    message: "Pool Funded. Happy trading.",
    type: "success",
    description: `Transaction - ${tx}`,
  });
}

function createSplAccount(
  instructions: TransactionInstruction[],
  payer: PublicKey,
  accountRentExempt: number,
  mint: PublicKey,
  owner: PublicKey,
  space: number,
  programId: PublicKey,
) {
  const account = new Account();
  instructions.push(
    SystemProgram.createAccount({
      fromPubkey: payer,
      newAccountPubkey: account.publicKey,
      lamports: accountRentExempt,
      space,
      programId,
    })
  );

  instructions.push(
    Token.createInitAccountInstruction(
      programId,
      mint,
      account.publicKey,
      owner
    )
  );

  return account;
}

function findAccountByMint(
  payer: PublicKey,
  owner: PublicKey,
  instructions: TransactionInstruction[],
  cleanupInstructions: TransactionInstruction[],
  accountRentExempt: number,
  mint: PublicKey, // use to identify same type
  signers: Account[],
  excluded?: Set<string>
): PublicKey {
  const accountToFind = mint.toBase58();
  const account = getCachedAccount(
    (acc) =>
      acc.info.mint.toBase58() === accountToFind &&
      acc.info.owner.toBase58() === owner.toBase58() &&
      (excluded === undefined || !excluded.has(acc.pubkey.toBase58()))
  );

  return account.pubkey;
}


