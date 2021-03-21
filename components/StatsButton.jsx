
import styled from 'styled-components'

const Button = styled.button`
  color: #FECA1A;
  border: 2px solid #FECA1A;
  border-radius: 10px;
  filter: drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25));
  transform: scale(1);
  transition: transform 0.3s ease 0s;

  box-sizing: border-box;;
  padding: .75rem;
  line-height: 1;
  letter-spacing: 0.01em;
`
const numRedeemed = 102;


export default function StatsButton() {
  return (
    <>
    <Button>
      <div className="space-x-2">
        <span>🔥</span>
        <span>{numRedeemed} redeemed</span>
      </div>
    </Button>
    </>
  );
}

