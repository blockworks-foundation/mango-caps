import React from 'react'
import styled from 'styled-components'

const SelectFrame = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  border-radius: 10px;
  color: #000;
  background-color: #fff;
  padding: 8px 12px 8px 12px;
  max-width: 84px;
  font-weight: 600;
  box-shadow: 0px 2px 6px rgba(170, 131, 0, 0.29);

  /* margin-top: 0.5rem;
  margin-bottom: 0.5rem; */
`

const SelectMenu = styled.div`
  font-size: 16px;
  /* margin: 1rem; */
  font-family: 'Inter', sans-serif;
  font-weight: 500;
  width: 100%;
  /* height: 48px; */
  box-sizing: border-box;
  margin: 0;
  /* appearance: none;
  display: flex;
  justify-content: flex-start;
  align-items: center; */
  border: none;
  /* padding: 0px 1rem 0px 1rem; */
  text-align: center;
`

const IncrementButton = styled.button`
  cursor: pointer;
  user-select: none;
  width: 48px;
  /* height: 48px; */
  font-size: 16px;
  display: flex;
  align-items: center;
  justify-content: ${props => props.justify};
  justify-content: center;
`

export default function IncrementToken(props) {

  function incrementAmount(inc) {
    props.setAmount(Math.max(props.min, Math.min(props.max,props.amount + inc)));
  }

  return (
    <SelectFrame>
      <IncrementButton style={{color: props.min == props.amount ? 'transparent' : 'black'}} justify={'flex-start'} onClick={() => incrementAmount(-1)} >
        -
      </IncrementButton>
      <SelectMenu>{props.amount}</SelectMenu>

      <IncrementButton style={{color: props.max == props.amount ? 'transparent' : 'black'}}
        justify={'flex-end'} onClick={() => incrementAmount(1)} >
        +
      </IncrementButton>
    </SelectFrame>
  )
}
