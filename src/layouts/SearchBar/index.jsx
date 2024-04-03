import { Form, Navbar, Row, Col, Dropdown, ButtonGroup, DropdownButton } from 'react-bootstrap';
import { BsSearch, BsFilterLeft } from "react-icons/bs";
import { key } from '@pages/Employees/js/keywords';
import style from '@style'


export default function SearchBar({ filterHandler, filterKeyWord, setFilterKeyWord }) {
  return (
    <>
      <Row>
        <Col className='mt-2 fw-bold' sm={6} xs={6} md={4}>
          查詢鍵:&nbsp;{key[filterKeyWord]}
        </Col>
        <Col sm={6} xs={6} md={6} className={style.xsSearchInput}>
          <Navbar.Brand className="fs-5">
            <Form.Group controlId="exampleForm.ControlInput1"
              onChange={filterHandler}
              className='position-relative'>
              <div className='position-absolute end-0 '>
                <Form.Label>
                  <BsSearch className='m-2 me-3' style={{ cursor: "pointer" }} />
                </Form.Label>
              </div>
              <Form.Control type="email" placeholder="Search" />
            </Form.Group>
          </Navbar.Brand>
        </Col>

        <Col md={1} sm={8} className={style.xsBreakPoint}></Col>

        <Col sm={4} md={2}>
          <DropdownButton
            as={ButtonGroup}
            size="sm"
            variant="light"

            onClick={(v) => {
              //切換查詢鍵
              if (v.target.innerText) {
                const reversedKey = Object.fromEntries(
                  Object.entries(key).map(([k, v]) => [v, k])
                );
                setFilterKeyWord(reversedKey[v.target.innerText])
              }
            }}
            title={<BsFilterLeft className='fs-4 ' />}>
            {Object.values(key).map(v => <Dropdown.Item
              className='z-5'
              key={v} >
              {v}
            </Dropdown.Item>)}
          </DropdownButton>
        </Col>
      </Row>
    </>
  )
}
