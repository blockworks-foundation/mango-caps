
import React, {} from 'react'
import styled from 'styled-components'


const Button = styled.button`
  color: #fff;
  border: 2px solid #575467;
  background: #575467;
  border-radius: 30px;
  transform: scale(1);
  transition: transform 0.3s ease 0s;
  box-sizing: border-box;;
  padding: .45rem .72rem;
  line-height: 1;
  letter-spacing: 0.01em;
  font-weight: 800;
  font-size: 22px;
`

export default function CapCount() {

  return (
    <>
    <Button>
      <div>
      <img
        height="30px"
        width="30px"
        src="/mcap_logo_round.png"
        style={{
          display: 'inline-block',
          verticalAlign: 'middle',
        }}
      />
        <span> = 8</span>
      </div>
    </Button>
    </>
  );
}

