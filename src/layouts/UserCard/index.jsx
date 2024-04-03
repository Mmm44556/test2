import { Card, ListGroup, Button, ProgressBar, Stack } from 'react-bootstrap';
export default function UserCard({ userState: { normalInfo, medicalInfo, reports, notifications }, Figure, role, save ,cardHeight}) {

  return (
    <Card 
      style={{ height: cardHeight ||""}}
    className='mt-4 text-center shadow p-3 mb-5 bg-body-tertiary rounded'>
      <Card.Body>
        <Card.Title className='pb-2'>
          {Figure ?? null}
        </Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          <p>{normalInfo["user_name"]}</p>
          <p>{medicalInfo["position_name"]}</p>
        </Card.Subtitle>
        <ListGroup variant="flush">
          <ListGroup.Item className='p-0 pb-3'>
            <address>
              <a href={`mailto:${normalInfo["user_mail"]}`}>
                {normalInfo["user_mail"]}
              </a>
            </address>
            {
              role === 'admin' ? <>  <Stack direction="horizontal" className='justify-content-center' gap={1}>
                <div className="p-0">
                  <Button variant="success" className='fw-bold' size="sm">
                    發送郵件
                  </Button>
                </div>
                <div className="p-0">
                  <Button variant="danger" className='fw-bold' size="sm"
                    onClick={save}
                  >
                    儲存修改
                  </Button>
                </div>

              </Stack></> : null
            }

          </ListGroup.Item>
          {
            role === 'admin' ? <> <ListGroup.Item className='d-flex justify-content-around'>
              <span>
                Posts

              </span>
              <span>
                {
                  notifications?.total ?? 0
                }
              </span>
            </ListGroup.Item>
            </>
              : null
          }
          <ListGroup.Item className='d-flex justify-content-around'>
            <span>
              報告量
            </span>
            <span>
              {
                reports?.total ?? '---'
              }
            </span>
          </ListGroup.Item>
          <ListGroup.Item>
            <ProgressBar now={(reports?.total ?? 5)} />
          </ListGroup.Item>
        </ListGroup>
      </Card.Body>
    </Card>
  )
}
