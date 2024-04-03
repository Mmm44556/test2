import { Suspense } from 'react';
import { useOutletContext } from 'react-router-dom';
import { Container, Col, Row } from 'react-bootstrap';
import UserCard from '../../layouts/UserCard';
import UserInfo from '../../layouts/UserInfo';


export default function Profile() {
  const [userState] = useOutletContext();

  return (
    <>
    <Suspense fallback={<h1>Loading......</h1>}>
    <Container fluid className='mt-3'>
      <Row>
        <Col sm={3}>
          <UserCard userState={userState} />
        </Col>
        <Col sm={9} className='pe-4'>
          <UserInfo userState={userState} />
        </Col>
      </Row>
    </Container>
    </Suspense>
    </>
  )
}