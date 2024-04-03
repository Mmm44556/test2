import { useEffect, useState, useMemo } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Tabs, Tab, Row, Col, ListGroup, Card, Stack, Button, Form, Badge, Modal, Spinner } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';
import DataTable from 'react-data-table-component';
import styled from 'styled-components'
import moment from 'moment';
import ReportModal from '@layouts/ReportModal';
import Proposal from '@components/Proposal';
import Review from '@components/Review';
import options from '@components/DepartmentChart/options';
import { Pie } from 'react-chartjs-2';
import { useTypeFiles, useTypeReports } from '@hooks/useTypeFiles';
import { useUpdatedAllReport } from '@hooks/useDepartmentFiles';
import { reportFieldKeys, zhKeys, reverseObject } from '@utils/reportFieldKeys';
import { dataProcess, downloadJSON } from '@utils/FileProcess/multiFiles';
import { customFilesStyles, fileColumns, TypeBadges } from './column';
import { BiSortAlt2 } from "react-icons/bi";
import { FaEdit, FaFileAlt, FaRegEdit } from "react-icons/fa";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { createToast } from '@utils/systemToastify';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { type } from '../../../utils/departmentKeys';
const BackgroundTabButtons = styled(Tabs)`
border-top-right-radius:0.375rem !important;
li{
button{
  border-top-right-radius:0.375rem !important;
  border-top-left-radius:0.375rem !important;
  margin-top:5px;
  color:#FFF;
  font-size:0.975rem;
  &:hover{
    color:#FFF;
  }
}
}
`;


export default function Type() {
  ChartJS.register(ArcElement, Tooltip, Legend);
  const param = useParams();
  const nav = useNavigate();
  const location = useLocation();
  //關閉編輯MODAL時重置路由
  const resetLocation = () => nav(location.pathname);
  const splitLocation = location.pathname.split('/');
  //判別當前部門
  const isDepartment = ['proposals', 'reviews'].includes(splitLocation[splitLocation.length - 1]);
  const queryClient = useQueryClient();
  const { data, isSuccess, isFetching } = useTypeFiles(param['*']);
  const typeReports = useTypeReports(queryClient);
  const [groupByData, setGroupByData] = useState([]);
  const [currentReportContent, setCurrentReportContent] = useState({ fileId: '', e: '' });
  const user = queryClient.getQueryData(['userCtx']);
  //開啟編輯檔案Modal
  const [lgShow, setLgShow] = useState(false);
  //當前選擇的檔案
  const [currentSelected, setCurrentSelected] = useState(null);

  const currentSelectedMemo = useMemo(() => currentSelected, [currentSelected]);
  //回覆內容
  const [proposalContext, setProposalContext] = useState('');
  //charts報告類別計算
  const [types, setTypes] = useState({ label: [], bg: [], counts: [] });
  const [proposalAndReview, setProposalAndReview] = useState({ label: [], bg: [], counts: [] });
  //重置編輯報告內容
  const exit = () => {
    resetLocation();
    setLgShow(false);
    setCurrentReportContent({ fileId: '', e: '' });
  };
  useEffect(() => {
    resetLocation();
  }, [])



  const rowOnclick = (row) => {
    const { fileId, data: { department } } = row;
    setCurrentSelected(row);
    setLgShow(true);
    typeReports.mutate({ fileId, department });
  }
  let typeKeys;
  useEffect(() => {
    if (isSuccess) {
      //對所有資料進行類別分類
      const groupData = Object.groupBy(data, ({ data }) => data.type);

      setGroupByData({ ALL: data, ...groupData })
      const bg = [];
      const bg2 = [];
      const counts = [];
      const a = Object.entries(groupData)

      typeKeys = a.map(e => {
        bg.push(TypeBadges[e[0]]?.color);
        counts.push(e[1].length);
        return TypeBadges[e[0]]?.str
      })
      setTypes(v => ({ ...v, label: typeKeys, bg, counts }));
      //如果再proposal、reviews部門就計算分類
      if (isDepartment) {

        // 把proposal、reviews用於charts分類
        const allReview = data.map(e => (e.data.reviewCtx)).flat(Infinity);

        const proposalAndReviewFiltered = allReview.map(e => {

          bg2.push(TypeBadges[e.type]?.color)
          return TypeBadges[e.type]?.str
        })

        const countMap = proposalAndReviewFiltered.reduce((acc, val) => {
          acc[val] = (acc[val] || 0) + 1;
          return acc;
        }, {});

        // // 分别存储中文和数量的数组
        const chineseArray = Object.keys(countMap);
        const countArray = Object.values(countMap);
        const setBg2 = Array.from(new Set(bg2));
        setProposalAndReview(v => ({ ...v, label: chineseArray, counts: countArray, bg: setBg2 }));

      
      }



    }

  }, [data, currentSelected]);

  return (
    <>
      {
        isSuccess ? <>
          <Row className='me-0  '>
            <Col lg={9} className="pe-0">
              <BackgroundTabButtons
                defaultActiveKey={Object.keys(groupByData)[0]}
                id="justify-tab-example"
                className="mb-3 bg-primary"
              >
                {Object.keys(groupByData).length > 0 ? ['proposals', 'reviews'].includes(splitLocation[splitLocation.length - 1]) ? (
                  <Tab active >
                    {
                      splitLocation[splitLocation.length - 1] === 'proposals' ? <Proposal
                        proposals={data} /> :
                        <Review reviews={data} />
                    }
                  </Tab >
                ) :
                  Object.keys(groupByData).map(key => (
                    <Tab
                      key={key}
                      eventKey={key}
                      title={TypeBadges[key]?.str}
                    >
                      <DataTable
                        customStyles={customFilesStyles}
                        columns={fileColumns}
                        data={groupByData[key] || []}
                        direction="auto"
                        onRowClicked={rowOnclick}
                        noDataComponent={<>
                          <h3 className="fw-bold">尚無資料</h3>
                        </>}
                        highlightOnHover
                        responsive
                        defaultSortFieldId={1}
                        progressPending={isFetching}
                        progressComponent={<h3>報告載入中...</h3>}
                        persistTableHead
                        pointerOnHover
                        subHeaderAlign="right"
                        subHeaderWrap
                        sortIcon={<BiSortAlt2 />}
                      />
                    </Tab>

                  )) : <Tab eventKey={'OPD'} title={'---------'}>
                  <div className=' text-center fs-4 fst-italic fw-lighter '>
                    <HiArchiveBoxXMark
                      className="fs-3 align-text-top text-secondary"
                    />
                    尚無報告
                  </div>
                </Tab>
                }
              </BackgroundTabButtons>
            </Col>
            <Col lg={3}
              className='border-start'>
              <div>
                {
                  isSuccess ? <Pie
                    options={options}
                    data={{
                      labels: isDepartment ? proposalAndReview.label: types.label,
                      datasets: [
                        {
                          backgroundColor: isDepartment ? proposalAndReview.bg : types.bg,
                          borderColor: '#FFF',
                          data: isDepartment ? proposalAndReview.counts : types.counts,

                        }
                      ]
                    }}
                  /> : "test"
                }

              </div>

            </Col>
          </Row>


          <ReportModal
            lgShow={lgShow}
            setLgShow={setLgShow}
            exit={exit}
            resetLocation={resetLocation}
            ModalHeader={<ModalHeader
              setProposalContext={setProposalContext}
              user={user}
              currentSelectedMemo={currentSelectedMemo}
              setCurrentSelected={setCurrentSelected}
              currentReportContent={currentReportContent}
              queryClient={queryClient}
              proposalContext={proposalContext}
            />} >

            <>
              <Row className='h-100'>

                <Col xs={12} md={8} lg={5} xxl={4}
                  className='bg-white border shadow-sm p-3 mb-5 bg-body rounded'
                  style={{ borderRadius: "1.125rem", overflow: 'overlay' }}>

                  <ModalReportTabs user={user}
                    currentSelectedMemo={currentSelectedMemo}
                    setCurrentReportContent={setCurrentReportContent}
                    setCurrentSelected={setCurrentSelected}
                    proposalContext={proposalContext}
                    setProposalContext={setProposalContext}
                  />

                </Col>
                <Col xs={6} md={4} lg={7} xxl={8} className='position-relative overflow-y-hidden'>

                  {
                    currentReportContent.e.length === 0 ? null : <Form
                      className='position-absolute w-100 h-100'>
                      <Form.Group className="mb-3 h-100 w-100" >
                        <Form.Control
                          as="textarea"
                          size='lg'
                          plaintext
                          value={currentReportContent.e}
                          className=' h-100 border-top border-bottom border-start p-1 bg-white'
                          onChange={(event) => {
                            setCurrentReportContent(e => ({ ...e, 'e': event.target.value }));
                          }}
                          readOnly={user.normalInfo.role_uid == 1 ? false : true}
                          style={{ resize: 'none', width: '95%' }}
                        />
                      </Form.Group>
                    </Form>
                  }
                </Col>
              </Row>
            </>
          </ReportModal>
        </> : <h2 className="position-absolute start-50 end-50"><Spinner animation="border" /></h2>
      }




    </>
  )
}


function Description({ content, owner }) {
  return (
    <Card className='mb-4'>
      <Card.Header
        style={{ fontSize: '1.1rem' }}
        className='fw-bold'
      >備註資訊
      </Card.Header>
      <Card.Body>
        <blockquote className="blockquote mb-0">
          <p>
            {content}
          </p>
          <footer className="blockquote-footer">
            <cite title="Source Title">
              備註人:
              {owner}</cite>
          </footer>
        </blockquote>
      </Card.Body>
    </Card>
  )
}

function SaveModal({ saveModalShow, setSaveModalShow, setConfirmSave }) {

  const handleClose = () => {
    setSaveModalShow(false);
    setConfirmSave(false);
  };
  const resetConfirm = () => setConfirmSave(false);
  return (
    <>

      <Modal
        show={saveModalShow}
        onHide={handleClose}
        onEnter={resetConfirm}
        onExit={resetConfirm}
        style={{ backgroundColor: '#00000024' }}>
        <Modal.Header closeButton className='border-0 '>
          <Modal.Title className="text-center">是否保存當前修改?</Modal.Title>
        </Modal.Header>
        <Modal.Footer className='border-'>
          <Button variant="secondary" onClick={handleClose}>
            取消
          </Button>
          <Button variant="danger" onClick={() => {
            setConfirmSave(true)
            setSaveModalShow(false);
          }}>
            儲存
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

function ModalHeader({ user, currentSelectedMemo, setCurrentSelected, currentReportContent, queryClient, proposalContext }) {
  const { hash } = useLocation();
  const { normalInfo: { role_uid } } = user;
  const { data, reports } = currentSelectedMemo;
  const [saveModalShow, setSaveModalShow] = useState(false);
  const [confirmSave, setConfirmSave] = useState(false);
  //更新資料庫的報告
  const { mutate, isLoading } = useUpdatedAllReport(queryClient);
  //尋找當前編輯的報告
  const findUpdatedReport = (e) => `#${e.fileId}` == hash;
  useEffect(() => {
    //保存提交
    if (confirmSave) {
      setCurrentSelected(prev => {
        const idx = prev.reports.findIndex(findUpdatedReport);
        const oldData = queryClient.getQueryData(['department', prev.data.department]);
        //就資料中找到當前編輯的病人報告
        const idx2 = oldData.findIndex(e => e.fileId == prev.fileId);
        prev.reports[idx] = currentReportContent;
        oldData[idx2] = prev;
        mutate({ oldData: oldData[idx2], currentData: currentReportContent, proposalContext, user });
        return { ...prev }
      });

    }
  }, [confirmSave])
  const saveBtn = () => {
    setSaveModalShow(true);
  }

  const reportState = () => {
    const currentReportState = reports.find(findUpdatedReport);

    return (
      <>

        {
          role_uid == 1 && hash.length !== 0 ? <Form

            onChange={(event) => {
              //尋找當前點擊的檔案處理提出報告、覆閱狀態
              setCurrentSelected(report => {
                report.reports.forEach(e => {
                  if (`#${e.fileId}` == hash) {
                    e.state[event.target.id] = event.target.checked;
                  }
                })
                return { ...report }
              })
            }}>
            <Form.Check
              type="switch"
              defaultChecked={currentReportState?.state.proposal || false}
              checked={currentReportState?.state.proposal || false}
              id="proposal"
              label="提出回覆"
            />
            <Form.Check
              type="switch"
              defaultChecked={currentReportState?.state.review || false}
              checked={currentReportState?.state?.review || false}
              label="開啟覆閱紀錄"
              id="review"
            />
          </Form> : null
        }
      </>
    )
  }
  return (
    <>
      <Row>
        <Col lg={6} >
          <Stack direction="horizontal" gap={3}>
            <div className="p-2 fs-4 fw-bold">
              {
                role_uid == 1 ? <>
                  <FaEdit className='align-baseline fs-5 ' />
                  編輯檔案
                </> : <>
                  <FaFileAlt className='align-baseline fs-5 ' />
                  檢視檔案
                </>
              }
            </div>
            {
              role_uid == 1 && hash.length !== 0 ? <div className="p-2 border-start">
                <SaveModal saveModalShow={saveModalShow} setSaveModalShow={setSaveModalShow} setConfirmSave={setConfirmSave} />
                <Button
                  onClick={saveBtn}
                  disabled={isLoading}
                  variant="danger" className='fw-bold' size="sm"
                >  儲存修改
                </Button>
              </div> : null
            }
            {
              data.department === 'RADIOLOGY' ? <div className="p-2 ">
                <Button
                  onClick={() => {
                    if (currentReportContent?.e == '') {
                      createToast(`尚未選擇報告!`, {
                        type: 'warning',
                        theme: 'colored',
                        position: "bottom-right",
                        autoClose: 3500
                      });
                      return
                    }
                    const { e, name } = currentReportContent

                    const json = dataProcess(e, name);
                    createToast(`下載中...`, {
                      type: 'info',
                      theme: 'colored',
                      position: "bottom-right",
                      autoClose: 3500
                    });
                    downloadJSON(json, name);
                  }}
                  variant="success"
                  className='fw-bold' size="sm"
                >  下載報告(.json)
                </Button>
              </div> : null
            }

          </Stack>
        </Col>
        <Col lg={6} >
          <Stack direction="horizontal" gap={1}>
            <div className="p-2 border-start">
              <Badge bg="warning" text="dark" style={{ fontSize: "0.8rem" }}>
                截止日期:
                {
                  data.date.deadline || '-----'
                }
              </Badge>
            </div>
            <div className="p-2 ">
              <Badge bg="warning" text="dark" style={{ fontSize: "0.8rem" }} >
                上次更新:
                {
                  data.date.update || '-----'
                }
              </Badge>
            </div>
            <div className="p-2 ">
              {reportState()}
            </div>
          </Stack>
        </Col>
      </Row>


    </>
  )
}
const tabsFormKeys = {
  type: ['ER', 'OPD', 'PE', 'MC', 'IP'],
  inspection: ['CT', 'MRI'],
  parts: ['LIVER', 'CHEST', 'KIDNEY', 'SPLEEN', 'LIVER_TRANSPLANT']

}
function ModalReportTabs({ currentSelectedMemo, setCurrentReportContent, setCurrentSelected, user, proposalContext, setProposalContext }) {
  const reverseObjectZhKeys = reverseObject(zhKeys);
  const { hash } = useLocation();

  const { reports, data } = currentSelectedMemo;
  //尋找當前編輯的報告
  const findUpdatedProposalReport = (e) => `#${e.fileId}` == hash;
  const currentReportProposalState = reports.find(findUpdatedProposalReport);
  //更換當前選的報告內容
  const rowSelectedChange = (e) => {
    const splitStr = e.split('#');

    const currentReport = reports.find(e => e.fileId === splitStr[1]);
    setCurrentReportContent((e) => {
      //當選到同個報告時避免重置報告、回覆內容
      if (splitStr[1] === e.fileId) {
        setProposalContext(v => v);
        return e
      };
      setProposalContext('')
      return currentReport
    });
  }


  return (
    <Tab.Container
      id="list-group-tabs-example"
      onSelect={rowSelectedChange}>
      <Row className='overflow-auto p-1 ' style={{ height: '100%' }}>
        {
          currentReportProposalState?.state.proposal ? <Col lg={12} sm={12} xl={12} className="mb-4">
            <Form.Group
              className="mb-3 h-100 w-100" >
              <Form.Control
                onChange={(e) => {
                  setProposalContext(e.target.value)
                }}
                as="textarea"
                size='lg'
                plaintext
                value={proposalContext}
                className=' h-100 p-1 border bg-white'
                placeholder='輸入回覆內容...'
                style={{ resize: 'none', width: '100%' }}
              />
            </Form.Group>
          </Col> : null
        }
        {
          data?.description ? <Col lg={12} sm={12} xl={12} >
            <Description
              owner={data.owner}
              content={data.description} />
          </Col> : null
        }
        <Col sm={4} >

          <ListGroup
            className="position-relative">
            {
              currentSelectedMemo.reports.length == 0 ? <h2 className="position-absolute start-50 end-50"><Spinner animation="border" /></h2> :
                currentSelectedMemo.reports.map((e) => {

                  return (
                    <ListGroup.Item action
                      href={`#${e.fileId}`}
                      key={e.fileId} >
                      {e?.name || e.fileId}
                    </ListGroup.Item>
                  )
                })
            }

          </ListGroup>
        </Col>
        <Col sm={8} >
          <Tab.Content>
            <Card style={{ width: '18rem' }} >
              <ListGroup variant="flush">
                {
                  reportFieldKeys(data).map((e, idx) => (
                    <ListGroup.Item key={e[0]} className='position-relative'>
                      <span >
                        {
                          e[0]
                        }
                        :</span>
                      <br />
                      <span className='fw-bold' style={{ fontSize: '1.1rem' }}>
                        {
                          user.normalInfo.role_uid == 1 ? <Form
                            onChange={(e) => {
                              setCurrentSelected(prev => {
                                const fileId = e.target.id;
                                return { ...prev, data: { ...prev.data, [fileId]: e.target.value } }
                              })
                            }}
                          >

                            {
                              ['title', 'patient'].includes(reverseObjectZhKeys[e[0]]) ?
                                <Form.Group className="mb-3"
                                  controlId={reverseObjectZhKeys[e[0]]}
                                  key={idx}
                                >
                                  <Form.Label
                                    style={{ right: '5px', top: '3px', cursor: 'pointer' }}
                                    className='position-absolute text-secondary '>
                                    <FaRegEdit className='fs-5' />
                                  </Form.Label>
                                  <Form.Control
                                    className="w-75 mt-1 mb-1 "
                                    value={e[1]}
                                    size="sm"
                                    type="text"
                                    id={reverseObjectZhKeys[e[0]]}
                                    placeholder={reverseObjectZhKeys[e[0]]}
                                    required
                                    isInvalid={!(e[1])}
                                    style={{ fontSize: '1.125rem' }}
                                  /> </Form.Group> :
                                <Form.Group className="mb-3"
                                  controlId={reverseObjectZhKeys[e[0]]}
                                >
                                  <Form.Label
                                    style={{ right: '5px', top: '3px', cursor: 'pointer' }}
                                    className='position-absolute text-secondary '>
                                    <FaRegEdit className='fs-5' />
                                  </Form.Label>

                                  <Form.Select
                                    size="sm"
                                    value={e[1]}
                                    className='w-75 mt-1 mb-1 '
                                    style={{ fontSize: '1.125rem' }}
                                    aria-label="Default select example">

                                    {
                                      tabsFormKeys[reverseObjectZhKeys[e[0]]].map(e => (
                                        <option
                                          value={reverseObjectZhKeys[e[0]]}>
                                          {
                                            e
                                          }
                                        </option>
                                      ))

                                    }
                                  </Form.Select>
                                </Form.Group>
                            }
                          </Form> : e[1]
                        }

                      </span>
                    </ListGroup.Item>))
                }
                <ListGroup.Item>
                  <span>
                    部門:
                  </span>
                  <br />
                  <span className='fw-bold' style={{ fontSize: '1.1rem' }}>
                    {
                      currentSelectedMemo.data.department || '-----'
                    }
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>
                    上傳者:
                  </span>
                  <br />
                  <span className='fw-bold' style={{ fontSize: '1.1rem' }}>
                    {
                      currentSelectedMemo.data.owner || '-----'
                    }
                  </span>
                </ListGroup.Item>
                <ListGroup.Item>
                  <span>
                    創建時間:
                  </span>
                  <br />
                  <span className='fw-bold' style={{ fontSize: '1.1rem' }}>
                    {
                      moment(currentSelectedMemo.data.date.created).format('YYYY-MM-DD h:mm:ss a')
                    }
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Card>
          </Tab.Content>
        </Col>
      </Row>
    </Tab.Container >
  );
}

