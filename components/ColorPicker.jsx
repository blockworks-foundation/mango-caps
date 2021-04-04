
import React, {} from 'react'
import styled from 'styled-components'

export default function BuyButton() {

  return (
    <>
      <ButtonWrapper>
      <Mango>
        <span>Mango</span>
      </Mango>
      <Black className="Black">
        <span>Black</span>
      </Black>
      </ButtonWrapper>
    </>
  );
}
const ButtonWrapper = styled.div`
  display: flex;
  padding: 0;
  border-radius: 15px;
  margin: 15px 0;
  `
const Mango = styled.button`
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 10px;
  border: solid 2px #D2CEDF;
  color: #C1BCD1;
  box-sizing: border-box;
  line-height: 1;
  letter-spacing: 0.01em;
  margin-right: 15px;

  :hover {
    color: #fff;
    border: none;
    border: 2px solid #ADABBD;
    background: linear-gradient(95.01deg, #FFE27E -10.18%, #FFC500 130.9%);

  }

  :focus {
    color: #fff;
    border: none;
    border: 2px solid #ADABBD;
    background: linear-gradient(95.01deg, #FFE27E -10.18%, #FFC500 130.9%);
    box-shadow: 0px 2px 6px rgba(170, 131, 0, 0.29);

  }
`
const Black = styled.button`
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 10px;
  border: solid 2px #D2CEDF;
  color: #C1BCD1;
  line-height: 1;
  letter-spacing: 0.01em;

  :hover {
    color: #fff;
    border: none;
    border: 2px solid #ADABBD;
    background: linear-gradient(95.01deg, #141125 -10.18%, #4D4D4D 130.9%);

  }

  :focus {
    color: #fff;
    border: none;
    border: 2px solid #ADABBD;
    background: linear-gradient(95.01deg, #141125 -10.18%, #4D4D4D 130.9%);
    box-shadow: 0px 2px 6px rgba(170, 131, 0, 0.29);

  }
`
