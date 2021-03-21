
import styled from 'styled-components'

const Button = styled.button`
  background: #EFEDF9;
  color: #696969;
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 10px;
  box-sizing: border-box;
  padding: .87rem;
  line-height: 1;
  letter-spacing: 0.01em;
  margin: 0 0 0 0;
`

export default function SellButton() {
  return (
    <>
    <Button>
        <span>Sell</span>
    </Button>
    </>
  );
}

