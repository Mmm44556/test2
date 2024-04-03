import React from 'react'
import { useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap'
import styled from 'styled-components';
import { FaScrewdriverWrench } from "react-icons/fa6";

const Container = styled.div`
background: rgb(236,222,222);
background: linear-gradient(58deg, rgba(236,222,222,1) 6%, rgba(238,238,238,1) 22%);
width:100dvw;
height:100dvh;
`
const Body = styled.div`
display:relative;
  position:absolute;
  left:50%;
  top:25%;
`
const Text = styled.span`
display:grid;
justify-content: center;
align-items:center;
div{
font-size:1.8rem;
font-weight:bold;
}

transform:translate(-50%,100%);
svg{
  margin-right:5px;
  vertical-align: text-top;
  font-size:inherit;
}

`
export default function NotFound() {
  const navigator = useNavigate();
  return (
    <Container>
      <Body>

        <Text>
          <div>
            <FaScrewdriverWrench />
            此頁面不存在
          </div>
          <div className='d-flex justify-content-center'>
            <Button
            variant="danger"
              onClick={() => navigator("/DashBoard/dataList",{replace:true})}
              className='w-75 fs-5 fw-bold'>
              返回
            </Button>
          </div>

        </Text>

      </Body>

    </Container>
  )
}
