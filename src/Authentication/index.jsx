import React, { useEffect, useState } from 'react'
import { Container, Row, Col, Tab, Tabs, Stack } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query'
import { useNavigate, Outlet } from 'react-router-dom';
import styled from 'styled-components';
import style from "@style";
import { FaCircleCheck } from "react-icons/fa6";
const TabsStyle = styled.div`
button[role="tab"]{
  font-size:20px;
  padding:0.875rem;
  background-Color:rgb(245 245 245);
}

`


export default function Authentication() {
  const Navigate = useNavigate();
  const queryClient = useQueryClient();
  //註冊通過轉導
  const [registerConfirm, setRegisterConfirm] = useState('sign-in');

  useEffect(() => {
    Navigate('sign-in', { replace: true })
    queryClient.removeQueries();
  }, [])
  return (
    <div  >
      <Container fluid className={style.authContainer} >

        <Row >
          <Col xl={3} md={6} sm={6} xs={6}
            style={{ 
              backgroundColor: 'rgb(46 68 98)' 
          }}
            className='p-0 align-items-center justify-content-center d-flex'>
            <Row 
            style={{ marginTop: '3%' ,
            paddingLeft:'1.8rem'}}
             className=' pe-3 gap-4 '>
              <Col xl={12} className='text-white'>
                <svg 
                className='align-bottom'
                width="40px" height="40px" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <rect width="48" height="48" fill="white" fill-opacity="0.01" />
                  <rect x="6" y="6" width="14" height="14" rx="2" fill="#2F88FF" stroke="#000000" stroke-width="4" stroke-linejoin="round" />
                  <rect x="6" y="28" width="14" height="14" rx="2" fill="#2F88FF" stroke="#000000" stroke-width="4" stroke-linejoin="round" />
                  <path d="M35 20C38.866 20 42 16.866 42 13C42 9.13401 38.866 6 35 6C31.134 6 28 9.13401 28 13C28 16.866 31.134 20 35 20Z" fill="#2F88FF" stroke="#000000" stroke-width="4" stroke-linejoin="round" />
                  <rect x="28" y="28" width="14" height="14" rx="2" fill="#2F88FF" stroke="#000000" stroke-width="4" stroke-linejoin="round" />
                </svg>
                <span 
                style={{fontSize:'1.8rem'}}
                className='fw-bold'>
                  RIS
                </span>
               <span className='fs-2'>
                  醫療報告系統
               </span>
              </Col>
              <Col>
                <Stack gap={3}>
                  {
                    [' 上傳、編輯功能', ' 報告分析', '登入系統', ' 醫療報告分類', '後台身份管理'].map(e => {
                      return (
                        <div className='d-flex align-items-center'>
                          <FaCircleCheck  
                            style={{ color:'#19ab6f',fontSize:'1.4rem'}}
                         />
                          <div 
                            style={{ fontSize: '1.1rem', color:'#e1e1e1'}}
                          className="p-2 fw-bold">
                            {e}
                          </div>
                        </div>
                      )
                    })
                  }
                </Stack>
              </Col>
            </Row>
          </Col>
          <Col
            className='m-0 p-0 d-flex justify-content-center align-items-center'>
            <TabsStyle
              style={{ height: '100dvh'}}
              className='flex-fill position-relative'>
              <Tabs
                className='border '
                defaultActiveKey="sign-in"
                activeKey={registerConfirm}
                fill
                onSelect={e => {
                  Navigate(e, { replace: true })

                  setRegisterConfirm(e)
                  return e
                }}

              >
                {/* <Tab eventKey={ 'sign-in'} title={ '登入'} /> */}
                {/* <Tab eventKey={ "sign-up"} title={'註冊'} /> */}
              </Tabs>

              <Outlet context={[Navigate, setRegisterConfirm]} />
            </TabsStyle>
          </Col>

        </Row>
      </Container>
    </div>
  )
}


