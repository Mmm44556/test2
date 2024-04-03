import { memo } from 'react';

import { Modal, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { MdLogout } from 'react-icons/md';

function Logout({ normalInfo, show, LogoutModalHandle }) {
  const navigator = useNavigate();
  
  const logout = async () => {
    let res = await fetch(`${import.meta.env.VITE_VAR_BASE_URL}/api/logout/${normalInfo.user_id}`, {
      method: 'DELETE',
      credentials: 'include',
      mode: 'cors',
    })
    if (res.status == 204) {
      navigator('/sign-in', { replace: true });


    }

  }

  return (
    <>
      <p style={{ fontSize: "1rem" }}
        onClick={LogoutModalHandle}
        className='mb-0 p-0' >
        <MdLogout /> 登出系統
      </p>

      <Modal show={show} onHide={LogoutModalHandle}>
        <Modal.Header >
          <Modal.Title>系統提示</Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center fw-bold">
          <pre className="text-start">
            <p>登出帳號: {normalInfo.user_name}</p>
            <p>系統時間: {new Date().toLocaleString()}</p>
          </pre>
          <p>---登出後將會保留當前紀錄---</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={LogoutModalHandle}>
            關閉
          </Button>
          <Button variant="danger" onClick={logout}>
            登出
          </Button>

        </Modal.Footer>
      </Modal>
    </>
  );
}
export default memo(Logout)
