import { TokenSwap, CurveType } from '@solana/spl-token-swap'
import { PublicKey } from "@solana/web3.js";

import styled from 'styled-components'

import WalletButton from  '../components/WalletButton'
import { addLiquidity } from '../lib/pool'
import { useConnection } from '../providers/connection'
import { usePool } from '../providers/pool'
import { useWallet } from '../providers/wallet'
import { useAccounts } from '../providers/accounts'

const Button = styled.button`
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  box-shadow: 0px 5px 11px rgba(170, 131, 0, 0.29);
  transform: scale(1);
  transition: transform 0.3s ease 0s;

  box-sizing: border-box;;
  padding: .87rem;
  line-height: 1;
  letter-spacing: 0.01em;
`

const Label = styled.span`
  font-size: 36;
  padding:  .87rem;
`


const bgConnected = 'linear-gradient(90.85deg, #6CBF00 -19.66%, #AFD803 128.7%)';
const bgDisconnected = 'linear-gradient(90.85deg, #E54033 -19.66%, #FECA1A 128.7%)'



export default function Setup() {

  const { connection, config } = useConnection();
  const { pool } = usePool();
  const { connected, wallet } = useWallet();
  const { capAccount, usdAccount } = useAccounts();

  function createSwap() {
    console.log( { connection, config, connected, wallet, capAccount, usdAccount } );
    if (connected) {
      addLiquidityNewPool(
        wallet,
        connection,
        [ {mintAddress: config.capMint, account: capAccount, amount: 500},
          {mintAddress: config.usdMint, account: usdAccount, amount: 1000 * 100000000}],
        { curveType: CurveType.ConstantProduct,
          token_b_offset: 5000,
          tradeFeeNumerator: 10,
          tradeFeeDenominator: 10000,
          ownerTradeFeeNumerator: 0,
          ownerTradeFeeDenominator: 1,
          ownerWithdrawFeeNumerator: 0,
          ownerWithdrawFeeDenominator: 1 },
        { token: new PublicKey(config.tokenProgramId),
          swap: new PublicKey(config.swapProgramId) });
    }
  }


  return (
    <div className="flex justify-center">
      <div className="flex-row">
        <div>
          <Label>1.</Label>
          <WalletButton />
        </div>
        <div>
          <Label>2.</Label>
          USD / CAP
          <pre>{usdAccount?.publicKey?.toString()}</pre>
          <pre>{capAccount?.publicKey?.toString()}</pre>
        </div>
        <div>
          <Label>3.</Label>
          <Button onClick={createSwap} style={{background: connected ? bgConnected : bgDisconnected}}>
            Create Swap
          </Button>
        </div>
        <div>
          <Label>4.</Label>
          <pre>{JSON.stringify(pool)}</pre>
        </div>
      </div>
    </div>);
}
