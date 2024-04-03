import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Offcanvas from 'react-bootstrap/Offcanvas';

import Register from '@authentication/Register'
function AddMember({ isFetching, children }) {

  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary"
        onClick={handleShow}
        disabled={isFetching}
      >
        {children}
      </Button>
      <Offcanvas show={show} onHide={handleClose} placement="end">
        <Offcanvas.Body>
          <Register
            Title={<>註冊新用戶</>}
            service={'admin'}
            location={`sign-up/${btoa('admin')}`}
          />
        </Offcanvas.Body>
      </Offcanvas>

    </>
  );
}


export default AddMember;