
import React, {} from 'react'
import styled from 'styled-components'

import { useAccounts } from '../providers/accounts'


const Button = styled.button`
  color: #fff;
  border: 2px solid #575467;
  background: #575467;
  border-radius: 30px;
  transform: scale(1);
  transition: transform 0.3s ease 0s;
  box-sizing: border-box;;
  padding: .45rem .72rem;
  line-height: 1.5;
  letter-spacing: 0.01em;
  font-weight: 800;
  font-size: 20px;
  cursor: default;
`

const Text = styled.div`

`


export default function CapCount() {

  const { walletCapBalance } = useAccounts();

  const centered = { display: 'inline-block', verticalAlign: 'middle' };

  return (
    <>
    { walletCapBalance > 0 &&
      <Button>
        <div style={centered}>
          &thinsp;{walletCapBalance}&ensp;
        </div>
        <img
          height="30px"
          width="30px"
          src="/mcap_logo_round.png"
          style={centered}
        />
      </Button>
    }
    </>
  );
}

