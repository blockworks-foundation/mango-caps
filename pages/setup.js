import { TokenSwap, CurveType } from '@solana/spl-token-swap'
import styled from 'styled-components'

import WalletButton from  '../components/WalletButton'
import { addLiquidity } from '../lib/pool'
import { useConnection } from '../providers/connection'
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
  const { connected, wallet } = useWallet();
  const { capAccount, usdAccount } = useAccounts();

  function createSwap() {
    console.log( { capAccount, usdAccount } );
    if (connected) {
      addLiquidity(
        wallet,
        connection,
        [ {mintAddress: config.capMint, account: capAccount, amount: 500},
          {mintAddress: config.usdMint, account: usdAccount, amount: 0}],
        { curveType: CurveType.Offset,
          tradeFeeNumerator: 10,
          tradeFeeDenominator: 10000,
          ownerTradeFeeNumerator: 0,
          ownerTradeFeeDenominator: 1,
          ownerWithdrawFeeNumerator: 0,
          ownerWithdrawFeeDenominator: 1 },
        { token: config.tokenProgramId,
          swap: config.swapProgramId });


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
          <Button onClick={createSwap} style={{background: connected ? bgConnected : bgDisconnected}}>
            Create Swap
          </Button>
        </div>
      </div>
    </div>);
}
