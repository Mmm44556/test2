import { useEffect, useMemo, useCallback } from "react";
import { useOutletContext } from 'react-router-dom';
import { Container, Row, Col, Card, ListGroup, Spinner } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';
import { VscFiles } from "react-icons/vsc";
import { FaArrowCircleRight } from "react-icons/fa";
import DepartmentChart from '@components/DepartmentChart';
import { useDepartmentFiles, reCategory } from "@hooks/useDepartmentFiles";
import styled from 'styled-components';
import { useDepartmentCounts } from "@hooks/useDepartmentCounts";
import { type } from "@utils/departmentKeys";
import { useTypeFiles } from '@hooks/useTypeFiles';
const Hover = styled.div`
  cursor:pointer;
a{
  cursor:pointer;
}
.card{
}
`
const Font = styled.div`
*{
  font-weight:bold;
}
`
export default function Departments() {

  const reviews = useTypeFiles('REVIEWS');
  const proposals = useTypeFiles('PROPOSALS');
  const { data, refetch, isSuccess } = useDepartmentFiles();
  const queryClient = useQueryClient();
  const departmentAll = queryClient.getQueryData(['department_Reports']);
  const [navigator] = useOutletContext();
  let reCategoryDepartment;
  if (isSuccess) {
    reCategoryDepartment = reCategory(data.data);
  }
  //處理proposals回覆數量
  const proposalsMemo = useMemo(() => proposals, [proposals]);
  const countProposals = useCallback(() => {
    if (proposals.isSuccess) {
      return proposals.data.map(e => {
        return e.data.proposalCtx.map(e => e)
      }).flat(Infinity);
    }
  }, [proposalsMemo])


  useEffect(() => {
    refetch();
  }, [isSuccess])
  //獲取reviews、proposals數量
  let allReview;
  let allProposal;
  if (reviews.isSuccess && proposals.isSuccess) {
    allReview = reviews?.data.map(e => (e.data.reviewCtx)).flat(Infinity);
    allProposal = countProposals();
  }


  return (
    <>
      <Font>
        <Container fluid>
          <Row className="mb-5">
            {
              isSuccess ? reCategoryDepartment[0].map((e, idx) => {
                return (
                  <Col key={idx}>
                    <Hover >
                      <Card
                        style={{ background: type[e.category].bg }}
                        onClick={() => navigator(`type/${type[e.category].title}`)}

                      >
                        <Card.Body className="text-white d-flex justify-content-between text-nowrap">
                          <div>
                            <Card.Title>
                              {e.category}
                            </Card.Title>
                            <Card.Text>
                              數量:&nbsp;{e.value}
                            </Card.Text>
                          </div>
                          <div>
                            <VscFiles className="fs-1 me-2 text-black-50" />
                          </div>
                        </Card.Body>
                        <ListGroup variant="flush">
                          <ListGroup.Item
                            className="text-center p-0"
                            style={{ backgroundColor: type[e.category].footer }}
                          >
                            <Card.Link
                              className="text-decoration-none text-white"
                            >
                              More info
                              <FaArrowCircleRight className="ms-1" />
                            </Card.Link>
                          </ListGroup.Item>
                        </ListGroup>
                      </Card>
                    </Hover>
                  </Col>
                )
              }) : ''
            }
          </Row>
          <Row className="mb-5">
            {
              isSuccess ? reCategoryDepartment[1].map(({ category, value }, idx) => {
                return (
                  <Col key={idx}>
                    <Hover >
                      <Card
                        style={{ background: type[category].bg }}
                        onClick={() => navigator(`type/${type[category].title}`)}>
                        <Card.Body className="text-white d-flex justify-content-between  text-nowrap">
                          <div>
                            <Card.Title>
                              {category}
                            </Card.Title>
                          </div>
                          <div>
                            <VscFiles
                              style={{ fontSize: '3.5cqw' }}
                              className=" me-4 text-black-50" />
                          </div>
                        </Card.Body>
                        <ListGroup variant="flush">
                          <ListGroup.Item
                            className="text-center "
                            style={{ backgroundColor: type[category].footer }}>
                            <Card.Link
                              className="text-decoration-none text-white"
                            >
                              More info
                              <FaArrowCircleRight className="ms-1" />
                            </Card.Link>
                          </ListGroup.Item>
                        </ListGroup>
                      </Card>
                    </Hover>
                  </Col>
                )
              }) : null
            }
          </Row>

          <Row>
            {
              reviews.isSuccess && proposals.isSuccess && isSuccess ?
                <>
                  {
                    [{ title: '院內各科報告', data: useDepartmentCounts(departmentAll, true) }, {
                      title: '本周已完成報告', data: useDepartmentCounts({
                        data: [{ 'REVIEWS': allReview.length }, {
                          'PROPOSALS': allProposal.length
                        }]
                      })
                    }].map((e, idx) => {

                      return (
                        <Col

                          key={idx}>
                          <Card >
                            <Card.Body className="ps-0 pe-0">
                              <Card.Title className="border-bottom ps-2">
                                {e.title}
                              </Card.Title>
                              <Card.Text>
                                <Row

                                >
                                  <Col key={idx} >

                                    <DepartmentChart data={e.data} />

                                  </Col>
                                </Row>
                              </Card.Text>
                            </Card.Body>
                          </Card>
                        </Col>
                      )
                    })
                  }
                </>
                : <Col
                  lg={12} md={12} xxl={12}
                  className="text-center d-flex justify-content-center gap-2"
                >
                  <Spinner
                    className="align-self-baseline"
                    style={{ width: "2rem", height: '2rem' }}
                    animation="border"
                    variant="dark" />
                  <span className="fs-4">
                    Loading...
                  </span>
                </Col>
            }

          </Row>
        </Container >
      </Font>
    </>
  )
}