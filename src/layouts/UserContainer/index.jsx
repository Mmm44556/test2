import { useState, memo } from 'react';
import Modal from 'react-bootstrap/Modal';

function UserContainer({ title, header, children, resetUpdateUserDate }) {

  const [lgShow, setLgShow] = useState(false);

  return (
    <>
      <div onClick={() => setLgShow(true)} className="me-2">
        {title}
      </div>
      <Modal
        size="xl"
        show={lgShow}
        onHide={() => {
          setLgShow(false);
          resetUpdateUserDate();
        }}
        aria-labelledby="example-modal-sizes-title-lg"
      >
        <Modal.Header closeButton>
          <Modal.Title id="example-modal-sizes-title-lg" className='fst-italic'>
            {header}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {children}
        </Modal.Body>
      </Modal>
    </>
  );
}

export default memo(UserContainer); 