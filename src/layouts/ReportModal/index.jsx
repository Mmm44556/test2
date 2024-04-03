import { useEffect, memo } from 'react';
import Modal from 'react-bootstrap/Modal';
import useBreakpoint from '@hooks/useBreakpoint';

function ReportModal({ lgShow, ModalHeader, children, exit, resetLocation },) {
  const breakpoint = useBreakpoint();
  return (
    <>
      <Modal
        size={'xl'}
        fullscreen={breakpoint === 'xxl' ? true : false}
        show={lgShow}
        onHide={exit}
        keyboard={false}
        backdrop="static"
        aria-labelledby="example-modal-sizes-title-xl"
      >
        <Modal.Header closeButton style={{ backgroundColor: 'rgb(251 253 255)' }}>
          <Modal.Title id="example-modal-sizes-title-xl" className='w-100'>
            {
              ModalHeader
            }
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className='w-100' style={{ backgroundColor: 'rgb(251 253 255)' }}>
          {children}
        </Modal.Body>
      </Modal>
    </>
  );
}




export default memo(ReportModal);