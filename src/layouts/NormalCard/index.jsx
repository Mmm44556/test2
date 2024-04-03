import {memo} from 'react'
import { Card } from 'react-bootstrap';
import styled from 'styled-components';
const Shadow = styled.div`

-webkit-animation: shadow-drop ${({ s }) => s}s ${({ delay }) => delay} cubic-bezier(0.215, 0.610, 0.355, 1.000) both;
animation: shadow-drop ${({ s }) => s}s ${({ delay }) => delay}s  cubic-bezier(0.215, 0.610, 0.355, 1.000) both;

@-webkit-keyframes shadow-drop {
  0% {
    -webkit-transform: translateZ(0);
            transform: translateZ(0);
    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
  100% {
    -webkit-transform: translateZ(50px);
            transform: translateZ(50px);
    -webkit-box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
            box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
  }
}
@keyframes shadow-drop {
  0% {
    opacity:0;
    -webkit-transform: translateZ(0);
            transform: translateZ(0);
    -webkit-box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
            box-shadow: 0 0 0 0 rgba(0, 0, 0, 0);
  }
  100% {
    opacity:1;
    -webkit-transform: translateZ(50px);
            transform: translateZ(50px);
    -webkit-box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
            box-shadow: 0 0 20px 0px rgba(0, 0, 0, 0.35);
  }
}

`
function NormalCard({ subtitle, Text, children, second, delay }) {
  return (
    <Shadow s={second} delay={delay}>
      <Card className='mt-4 text-center shadow p-3 mb-5 bg-body-tertiary rounded'

      >
        <Card.Body>
          {
            subtitle ? <Card.Subtitle className="mb-2 text-muted text-end">
              {
                subtitle
              }
            </Card.Subtitle> : null
          }

          <Card.Text>
            {
              children
            }
          </Card.Text>
        </Card.Body>
      </Card>
    </Shadow>
  )
}
export default memo(NormalCard);
