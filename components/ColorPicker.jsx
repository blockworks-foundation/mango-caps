import React from "react"
import styled, { css } from "styled-components"

export default function BuyButton({ setStyle, style }) {
  return (
    <>
      <ButtonWrapper>
        <Mango onClick={() => setStyle("gold")} capStyle={style}>
          <span>Mango</span>
        </Mango>
        <Black className="Black" onClick={() => setStyle("black")} capStyle={style}>
          <span>Black</span>
        </Black>
      </ButtonWrapper>
    </>
  )
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
  border: solid 2px #d2cedf;
  color: #c1bcd1;
  box-sizing: border-box;
  line-height: 1;
  letter-spacing: 0.01em;
  margin-right: 15px;

  ${(props) =>
    props.capStyle === "gold" &&
    css`
      color: #fff;
      border: none;
      border: 2px solid #adabbd;
      background: linear-gradient(95.01deg, #ffe27e -10.18%, #ffc500 130.9%);
      box-shadow: 0px 2px 6px rgba(170, 131, 0, 0.29);
    `}

  :hover {
    color: #fff;
    border: none;
    border: 2px solid #adabbd;
    background: linear-gradient(95.01deg, #ffe27e -10.18%, #ffc500 130.9%);
  }

  :focus {
    color: #fff;
    border: none;
    border: 2px solid #adabbd;
    background: linear-gradient(95.01deg, #ffe27e -10.18%, #ffc500 130.9%);
    box-shadow: 0px 2px 6px rgba(170, 131, 0, 0.29);
  }
`
const Black = styled.button`
  height: 50px;
  width: 100%;
  border: none;
  border-radius: 10px;
  border: solid 2px #d2cedf;
  color: #c1bcd1;
  line-height: 1;
  letter-spacing: 0.01em;

  ${(props) =>
    props.capStyle === "black" &&
    css`
      color: #fff;
      border: none;
      border: 2px solid #adabbd;
      background: linear-gradient(95.01deg, #141125 -10.18%, #4d4d4d 130.9%);
      box-shadow: 0px 2px 6px rgba(170, 131, 0, 0.29);
    `}

  :hover {
    color: #fff;
    border: none;
    border: 2px solid #adabbd;
    background: linear-gradient(95.01deg, #141125 -10.18%, #4d4d4d 130.9%);
  }

  :focus {
    color: #fff;
    border: none;
    border: 2px solid #adabbd;
    background: linear-gradient(95.01deg, #141125 -10.18%, #4d4d4d 130.9%);
    box-shadow: 0px 2px 6px rgba(170, 131, 0, 0.29);
  }
`
