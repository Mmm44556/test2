import { useCallback, useMemo, useEffect, useContext } from 'react';
import { Container, ListGroup, Tab, Row, Col, Nav, Card, Stack, Badge } from 'react-bootstrap';
import UserCard from '../../layouts/UserCard';
import Figure from '@assets/styled/FigureStyle';
import { sex, role } from '@utils/sexKeys';
import styled from 'styled-components';
import { IoIosArrowForward } from "react-icons/io";

import { useOutletContext } from 'react-router-dom';
const ActiveItems = styled(ListGroup)`
transition:box-shadow .3s  ease-in-out;

span{
  font-size:1.1rem;
}
&:hover{
cursor:pointer;
border-radius:0.375rem;
-webkit-box-shadow: 14px 23px 18px -7px rgba(0,0,0,0.11);
-moz-box-shadow: 14px 23px 18px -7px rgba(0,0,0,0.11);
box-shadow: 14px 23px 18px -7px rgba(0,0,0,0.11);


}
.active{
background-Color: #f7f7f7 ;

}
`


export default function Proposal({ proposals }) {

  const [firstData] = proposals;

  return (
    proposals.length == 0 ? 'No DATA!' : <Container
      style={{ height: '100dvh', overflowY: 'scroll' }}

    >
      <Tab.Container
        defaultActiveKey={firstData.data.proposalCtx[0].time || ''}
      >
        <Row>
          <Col sm={3}

            className='position-relative'>
            <Tab.Content
              style={{ width: '15rem' }}
              className='position-fixed '>
              {
                proposals.map(e => {
                  const { data } = e;
                  const { proposalCtx } = data;

                  return proposalCtx.map((user) => {


                    return (
                      <Tab.Pane eventKey={user.time}>
                        <UserCard
                          userState={user.proposer}
                        />
                      </Tab.Pane>)

                  })
                })
              }
            </Tab.Content>
          </Col>
          <Col sm={9} className="ps-5 pe-0 ">
            <Nav variant="pills"
              style={{ borderLeft: '0.1rem solid rgb(233 227 227)' }}
              className="flex-column d-flex gap-2">
              {
                proposals.map(e => {
                  const { data } = e;
                  const { proposalCtx } = data;

                  return proposalCtx.map((user, idx) => {

                    const { proposer: { normalInfo }, path } = user;
                    const UpperStr = normalInfo.user_sex.toUpperCase();
                    return (
                      <Card
                        style={{
                          borderRadius: '0 ',
                          borderBottom: '0.2rem solid rgb(233 227 227)',
                          borderTop: '0 ',
                          borderLeft: '0',
                          borderRight: '0',
                          maxWidth: '100%'

                        }}
                      >
                        <Card.Body>
                          <Card.Title>
                            <ActiveItems
                              className="list-group-flush"
                            >
                              <ListGroup.Item
                                className='text-black border-0 '
                                eventKey={user.time}>
                                <Stack direction="horizontal" >
                                  <div className="p-2 pb-3">
                                    <Figure bg={sex[UpperStr]?.color}
                                      style={{ width: '2.3rem', height: '2.3rem' }}
                                      className="d-flex justify-content-center align-items-center"
                                    >
                                      <span>
                                        {normalInfo.user_name.charAt(0)}
                                      </span>
                                    </Figure>
                                  </div>

                                  <div className="p-2 ps-0">
                                    <div className="mb-1 fw-bold text-primary ">
                                      <span>
                                        {
                                          normalInfo.user_name
                                        }
                                      </span>
                                      <span>
                                        <IoIosArrowForward className='text-black fs-5 align-text-bottom' />
                                      </span>
                                      <span>
                                        {
                                          path
                                        }
                                      </span>
                                    </div>
                                    <div className='text-secondary fst-italic fw-bold'
                                    >
                                      回覆時間:
                                      <Badge pill bg="success"
                                        style={{ fontSize: '0.75cqw' }}>
                                        {
                                          user.time
                                        }
                                      </Badge>

                                    </div>
                                  </div>
                                </Stack>

                              </ListGroup.Item>
                            </ActiveItems>
                          </Card.Title>
                          <Card.Text className="text-secondary fw-bold ps-4 ">
                            <span
                              className='me-2 
                             text-nowrap '>
                              內容:
                            </span>
                            <span
                              style={{ fontSize: '1.1cqw' }}
                              className='w-100 text-break'>
                              {
                                user.content
                              }
                            </span>
                          </Card.Text>
                        </Card.Body>


                      </Card>
                    )
                  })
                })
              }
            </Nav>
            {/* <ListGroup as="ol" >

              <ListGroup.Item as="button" className='text-black border-0' eventKey={user.time}>
                <Card>
                  <Card.Title>Card Title</Card.Title>
                  <Card.Text>
                    {
                      user.time
                    }
                  </Card.Text>

                </Card>
              </ListGroup.Item>


            </ListGroup> */}

          </Col>
        </Row>
      </Tab.Container>
    </Container>

  )
}
