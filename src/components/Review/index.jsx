import {useEffect} from 'react'
import { Container, Table, Badge } from 'react-bootstrap';
import { TypeBadges } from '@utils/departmentKeys';



export default function Review({ reviews }) {

  //依照時間排序reviews
  const allReview = reviews.map(e => (e.data.reviewCtx)).flat(Infinity);
  allReview.sort((a, b) => new Date(a.time) - new Date(b.time));


  return (
    reviews.length == 0 ? '456' :
      <Container>
        <Table striped bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>類別</th>
              <th>病例路徑</th>
              <th>報告醫師</th>
              <th>檢查方法</th>
              <th>檢查部位</th>
              <th>覆閱時間</th>
            </tr>
          </thead>
          <tbody>
            {allReview.map((e, idx) => {
              const { path, reviewer: { normalInfo }, type, inspection ,time} = e;
              const typeObj = TypeBadges[type];
              return (
                <>
                  <tr>
                    <td>{idx}</td>
                    <td>
                      {
                        <Badge bg={typeObj?.bg} style={{ fontSize: "1cqi" }} >
                          {typeObj?.str}
                        </Badge>
                      }
                    </td>
                    <td>{path}</td>
                    <td>{normalInfo.user_name}</td>
                    <td>{inspection}</td>
                    <td>{e?.parts||'N/A'}</td>
                    <td>{time}</td>
                  </tr>

                </>
              )
            })}
          </tbody>
        </Table>
      </Container>
  )
}
