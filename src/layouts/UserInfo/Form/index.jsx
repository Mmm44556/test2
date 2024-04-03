import {  memo } from 'react';
import { Button } from 'react-bootstrap';
import {useLocation} from 'react-router-dom';
import { userToKeys } from '@hooks/userToKey';
import style from '@style';
import { useInfoValidation } from '@hooks/userInfoValidation';
import EditModal from '../EditModal';


function Form({ fetch: { normalInfo, setNormalInfo, fetcher, userState, setEdit, edit } }) {

  const { resetUserInfo, normalInfoChange } = useInfoValidation(setNormalInfo, userState);
  const location = useLocation();
  const submitter = () => {
    if (edit) {
      fetcher.submit({ ...userState.normalInfo, ...normalInfo }, {
        action: location.pathname,
        method: 'PATCH'
      })
    }
    setEdit(v => !v)
  }
  return (
    <>
      <fetcher.Form
        onInput={normalInfoChange(setNormalInfo)}
        className={style.normalInfo}
      >
        <table>
          {userToKeys.normalInfo(normalInfo).length ?
            userToKeys.normalInfo(normalInfo, edit) : '尚無資料'}
        </table>
        <div className="hstack gap-3 position-absolute end-0 top-0 mt-2 me-2">
          <EditModal
            edit={edit}
            type={'button'}
            userState={userState}
            fetcher={fetcher}
          />

          <EditModal
            setNormalInfo={resetUserInfo}
            type={'reset'}
            edit={edit}
          />


          <Button variant="light" className='fw-bold' type={'button'}
            onClick={submitter}
          >
            {edit ? '儲存' : '編輯'}
          </Button>
        </div>
      </fetcher.Form>
    </>
  )
}
export default memo(Form);