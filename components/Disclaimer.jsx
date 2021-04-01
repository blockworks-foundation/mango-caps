
import styled from 'styled-components'

const Text = styled.p`
display: flex;
background: #ffffff08;
color: #56516b;
width: 100%;
border: none;
border-radius: 10px;
box-sizing: border-box;
padding: .87rem;
-webkit-letter-spacing: 0.01em;
-moz-letter-spacing: 0.01em;
-ms-letter-spacing: 0.01em;
letter-spacing: 0.01em;
line-height: 20px;
margin: 15px 0px;
margin-bottom: 100px
`

export default function Disclaimer() {

  const margin = { marginRight: '10px'};
  return (

    
    <>
    <Text>
    <img
          height="50px"
          width="50px"
          src="/error4.svg"
          style={margin}
        />
        <span>This redeemable token is <b>not connected</b> to our upcoming protocol and governance.</span>
    </Text>
    </>
  );
}

