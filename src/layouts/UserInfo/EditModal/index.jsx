import { useState, memo, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Button, Modal } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { createToast } from '@utils/systemToastify';
import style from '@style';
function EditModal({ setNormalInfo, type, fetcher, userState }) {
  const location = useLocation();
  const formRef = useRef();
  const queryClient = useQueryClient();
  const [hasLength, setHasLength] = useState(false);
  const { func, header, body, footer } = description(type, formRef, fetcher, setHasLength);
  const [show, setShow] = useState(false);
  const handleModalShow = () => setShow(v => !v);
  const resetButton = () => {
    handleModalShow();
    createToast(<span className='fw-bold'>重置成功</span>, {
      theme: "light",
      type: 'info',
      autoClose: 2500
    })
    return setNormalInfo();

  }


  return (
    <>
      <Button variant="light" className='fw-bold'
        type={type}
        onClick={handleModalShow}
      >
        {func}
      </Button>
      <Modal show={show}
        onHide={handleModalShow}
        animation={false} centered
        className='text-center'
        onShow={type === 'reset' ? () => null : () => {
          Object.values(formRef.current).forEach(v => {
            if (v.localName == 'input') { //判斷是否是Input標籤
              if (v.value.length == 0) {
                setHasLength(true)
                return;
              }
            }
            return;
          })
        }}
      >
        <Modal.Header
          className='border border-0 justify-content-center '>
          <Modal.Title className='fw-bold' >{header}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{body}</Modal.Body>
        <Modal.Footer className='border border-0'>
          <Button variant="secondary" onClick={handleModalShow}>
            取消
          </Button>
          <Button variant="danger" onClick={type === 'reset' ? resetButton : (() => {
            console.log(userState.normalInfo)
            if (formRef.current[0].value == userState.normalInfo['user_password']) {

              const newPassword = formRef.current[1].value;

              fetcher.submit({ ...userState.normalInfo, user_password: newPassword }, {
                action: location.pathname,
                method: 'PATCH'
              })
              const user = queryClient.getQueryData(['userCtx']);

              const mutationUser = { ...user, normalInfo: { ...user.normalInfo, user_password: newPassword } };
              queryClient.setQueryData(['userCtx'], mutationUser);
              return;
            }

            createToast(<span className='fw-bold'>密碼錯誤</span>, {
              theme: "light",
              autoClose: 2500,
              type: "error",
            })

          })}
            type={type}
            disabled={hasLength}
          >
            {footer}
          </Button>

        </Modal.Footer>
      </Modal>

    </>
  )

}
function description(type, formRef, fetcher, setHasLength) {

  switch (type) {
    case 'button':
      //如果輸入長度為0關閉確認按鈕
      const enabledConfirmButton = () => {
        if (formRef.current[0].value.length !== 0 && formRef.current[1].value.length !== 0) {
          setHasLength(false)
        } else {
          setHasLength(true)
        }
      }
      return {
        func: "重設密碼",
        header: "確定修改密碼?",
        body: <fetcher.Form
          ref={formRef}
          onInput={enabledConfirmButton}
        >
          <div
            className={`${style.normalInfo} vstack gap-2`}>
            <p>
              <h5 className='d-inline fw-bold me-2'>舊密碼:</h5>
              <input type="password" name="oldPassword"
                className="w-50"
                required
                minLength="0"
                maxLength="12"
                placeholder='password' />
            </p>
            <p>
              <h5 className='d-inline fw-bold me-2'>新密碼:</h5>

              <input type="password" name="newPassword"
                className="w-50"
                required
                minLength="0"
                maxLength="12"
                placeholder='password' />
            </p>
          </div>
        </fetcher.Form>,
        footer: "確定"
      }
    case 'reset':
      return {
        func: "重置",
        header: "確定移除當前變更?",
        body: <>你的任何變更都將遺失<sub>。</sub></>,
        footer: "重設變更"
      }
  }
}

export default memo(EditModal);