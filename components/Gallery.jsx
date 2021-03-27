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

export default function Gallery() {
  return (
    <GalleryFrame>
      <ImgStyle src="/caps/style1.png" alt="Logo" />
    </GalleryFrame>
  )
}

