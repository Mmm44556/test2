import { useEffect, useState, memo } from 'react';
import Toast from 'react-bootstrap/Toast';
import Spinner from 'react-bootstrap/Spinner';
import { QueryObserver, useQueryClient } from '@tanstack/react-query';
import { AiOutlineCheck } from "react-icons/ai";
import style from '@style';

function subscribeUserCtx(queryClient) {
  const observer = new QueryObserver(queryClient, { queryKey: ['userCtx'] })
  const unsubscribe = observer.subscribe(result => {
    // console.log(result)
  })

}


const SystemToast = ({ showToast, createDetail, toggleShow }) => {
  const queryClient = useQueryClient();
  const user = queryClient.getQueryData(['userCtx']);
  useEffect(() => {

    if (user) {
      // console.log('@@')
      subscribeUserCtx(queryClient)
    }

  }, [user])


  const [layout, setLayout] = useState(style.fadeIn);
  //設定fadeOut
  useEffect(() => {
    const classTimer = setTimeout(() => setLayout(style.fadeOut), 2000);
    return () => {
      clearTimeout(classTimer);
      setLayout(style.fadeIn);
    }
  }, [showToast])


  return (
    <Toast
      onMouseOver={() => setLayout(style.fadeIn)}
      onMouseLeave={() => setLayout(style.fadeOut)}
      show={showToast}
      onAnimationEnd={() => {
        toggleShow();
      }}
      onClose={toggleShow}
      bg={createDetail.theme.toLowerCase()}
      className={`${layout} `}
      style={{ background: (createDetail.theme ?? '#ffdb36') }}
    >

      <Toast.Header>
        {createDetail.spinner ? <Spinner animation="border" variant={createDetail.theme} style={{ width: '1rem', height: '1rem' }} /> : <AiOutlineCheck />}
        <strong className="me-auto">
          系統提示-
          <span>{createDetail.detail}</span>
        </strong>
        <small>{createDetail.timeStamp}</small>
      </Toast.Header>
    </Toast>
  );
}
export default memo(SystemToast)

