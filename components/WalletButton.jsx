import styled from 'styled-components'
import { useWallet } from '../providers/wallet'

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

export const bgConnected = 'linear-gradient(90.85deg, #6CBF00 -19.66%, #AFD803 128.7%)';
export const bgDisconnected = 'linear-gradient(90.85deg, #E54033 -19.66%, #FECA1A 128.7%)';

const connected = true;
const walletHash = '0x24da3...';

export default function WalletButton() {

  const { connected, wallet } = useWallet();

  function handleClick() {
    if (!connected) {
      wallet.connect();
    } else {
      wallet.disconnect();
    }
  };

  return (
    <>
    <Button onClick={handleClick} style={{background: connected ? bgConnected : bgDisconnected}}>
      { (wallet && connected) &&
        <div className="space-x-2">
          <span>🔑</span>
          <span>{walletHash}</span>
        </div>
      }
      { (!(wallet && connected)) && "Connect Wallet" }
    </Button>
    </>
  );
}

