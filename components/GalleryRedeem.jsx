import * as React from 'react'
import styled from 'styled-components'


const GalleryFrame = styled.div`
  width: 100%;
  height: 80%;
  min-height: 258px;
  display: flex;
  align-items: center;
  flex-direction: center;
`

const ImgStyle = styled.img`
  width: 100%;
  box-sizing: border-box;
  border-radius: 4px;
`

export default function GalleryRedeem() {

  return (
    <>
    <GalleryFrame>
      <ImgStyle src="/caps/mcap_black.png" alt="Logo" />
    </GalleryFrame>
    </>
  )
}

