import { useEffect ,Suspense} from 'react';
import { useState } from 'react';
import { Button, Container, Col, Row, Form } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';
import FileDropZone from './FileDropZone';
import FilesForm from './FilesForm';
import { deleteDisk, uploadFiles } from './filesAction';
import { updateDepartmentReportsCounts } from '@hooks/useDepartmentFiles';
import { createToast } from '@utils/SystemToastify';
import styled from 'styled-components';

const OverflowCol = styled(Col)`
  height:35cqh;
  overflow-y: auto;
  resize:vertical;
  scroll-behavior: smooth; 
  position: relative;
  border-bottom:1.3px solid rgb(197 197 197);
  margin-bottom:1.5rem;
/* 定制滚动条的样式 */
::-webkit-scrollbar {
  width: 12px; /* 宽度 */
}

::-webkit-scrollbar-thumb {
  background-color: #888; /* 滚动条上的拖动手柄的颜色 */
  border-radius: 6px; /* 圆角 */
}

::-webkit-scrollbar-track {
  background-color: #eee; /* 滚动条轨道的颜色 */
}

/* 悬停在滚动条上时的样式 */
::-webkit-scrollbar-thumb:hover {
  background-color: #555;
}

/* 禁用浏览器自带的外观效果（部分浏览器有效） */

  scrollbar-width: thin; /* Firefox */
  scrollbar-color: #888 #eee; /* Firefox */
`
const requiredProperties = ['patient', 'title', 'type', 'department', 'inspection'];
function hasRequiredProperties(form) {

  const bool = requiredProperties.every(prop => form.hasOwnProperty(prop));
  return bool
}


function Uploader() {
  const queryClient = useQueryClient();
  const [files, setFiles] = useState([]);
  const [form, setForm] = useState({});
  //格式化後返回的所有結果
  const [response, setResponse] = useState(null);
  //是否添加額外補充
  const [additional, setAdditional] = useState(false);
  //更新所有部門報告數量
  const departmentMutation = updateDepartmentReportsCounts(queryClient);
  const resetAll = () => {
    setFiles([]);
    setResponse(null);
  }
  useEffect(() => {
    return () => {
      //刪除server端的緩存資料
      deleteDisk('all');
      resetAll();
    }
  }, [])

  //提交上傳表單
  const submitForm = (e) => {
    e.preventDefault();
    const { normalInfo: { uuid, user_name } } = queryClient.getQueryData(['userCtx']);
    //檢查表單是否填妥
    if (hasRequiredProperties(form)) {
      const newForm = { ...form, uuid, owner: user_name };
      const jsonRes = JSON.stringify(response);
      const jsonForm = JSON.stringify(newForm);

      const blobRes = new Blob([jsonRes, '$', jsonForm], { type: 'application/json' });

      const uploadStatus = uploadFiles(blobRes);
      uploadStatus.then(e => {
        if (e.ok) {
          departmentMutation.mutate({ department: form.department, count:1 })
          createToast('上傳成功!', {
            theme: 'dark',
            type: 'success',
            autoClose: 5000
          });
          //重置所有表單
          deleteDisk('all');
          resetAll();
        }
      });
    } else {
      createToast('表單不可為空!', {
        theme: 'colored',
        position: 'top-center',
        type: 'warning',
        autoClose: 2000
      });
    }
    return;
  }

  return (
    <Suspense fallback={<h1>Loading...</h1>}>
      <Form
        onSubmit={submitForm}
        onChange={({ target }) => {
          if (target.name === 'description') {
            setForm(v => {
              v[target.name] = target.value;
              return v;
            })
          }
          return
        }}
      >
        <Container>
          <Row>
            <Row>
              <OverflowCol md={12}
                className='overflow-auto '>
                <FileDropZone
                  files={files}
                  form={form}
                  setResponse={setResponse}
                  setFiles={setFiles} />

              </OverflowCol>
            </Row>
            <Row>
              <Col md={12}>
                <FilesForm setForm={setForm} setAdditional={setAdditional} />
              </Col>
              {
                additional ? <Additional /> : null
              }

            </Row>
            <Row>
              <Col className='d-flex justify-content-end'>
                <Button
                  variant="danger"
                  size="md"
                  className="ms-4 mt-2"
                  disabled={!files.length}

                  onClick={() => {
                    if (confirm('確定清除檔案區?')) {
                      setFiles([]);
                      setResponse(null);

                    };
                  }}>
                  清除文件區
                </Button>
                <Button
                  variant="primary"
                  size="md"
                  type='submit'
                  className="ms-4 mt-2"
                  disabled={!files.length}
                >
                  上傳
                </Button>
              </Col>
            </Row>

          </Row>

        </Container>
      </Form>
    </Suspense>
  );
}
function Additional() {
  return (
    <Col md={12} lg={12} ms={12}>
      <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
        <Form.Label>說明:</Form.Label>
        <Form.Control name="description" as="textarea" rows={3} />
      </Form.Group>

    </Col>
  )
}


export default Uploader;