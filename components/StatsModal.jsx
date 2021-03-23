import React from 'react'
import styled from 'styled-components'

export default function StatsModal({open, onClose}) {
if (!open) return null

  return (

        <>
        <OVERLAY_STYLES> </OVERLAY_STYLES>
        <CardWrapper>
        <Title>$MCAP Stats</Title>
        <br />
          <Description>
              <p>
                <span>
                  🧢
                </span>
                Initial $MCAP
              </p>
              <p>500</p>
          </Description>
          <Description>
              <p>
                <span>
                  🔥
                </span>
                Redeemed $MCAP
              </p>
              <p>500</p>
          </Description>
          <Description>
              <p>
                <span>
                  💦
                </span>
                $MCAP Pool
              </p>
              <p>500</p>
          </Description>
          <Shim />
          <Text>
          <a
            href="#"
            target="_blank"
            rel="noopener noreferrer"
          >
          Read more.
          </a>
          </Text>
          <br />
          <button onClick={onClose}>Close</button>
        </CardWrapper>
        </>
  )
}

const Shim = styled.div`
  height: 2rem;
  `
const Title = styled.h2`
  font-weight: 500;
  font-size: 24px;
  line-height: 126.7%;
  width: 100%;
  margin: 0;
  text-align: center;
  `

const Description = styled.div`
  display: flex;
  justify-content: space-between;
  color: white;
  font-weight: 400;
  margin-left: 1rem;
  margin-right: 1rem;
  margin-bottom: 1rem;

  p {
    margin: 0;
  }
`

const CardWrapper = styled.div`
  background: #000000;
  background: linear-gradient(162.92deg, #2b2b2b 12.36%, #000000 94.75%);
  box-shadow: 0px 4px 20px rgba(0, 0, 0, 0.4);
  position: fixed;
  width: 400px;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 20px; 
  color: #fff;
  display: flex;
  flex-direction: column;
  flex-wrap: wrap;

  cursor: default;
  padding: 24px;
  z-index: 1000;
`

const Text = styled.p`
  font-weight: 500;
  font-size: 18px;
  width: 100%;
  margin: 0;
  text-align: center;
`
const OVERLAY_STYLES = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #000;
  opacity: .8;
  z-index:998;
`


