import { memo, useState,useEffect } from 'react'
import { Table } from 'react-bootstrap';
import { useFetcher } from 'react-router-dom';
import Form from './Form';
import { userToKeys } from '../../hooks/userToKey';
import { useUpdateForm } from './hooks/useForm';

const fontStyle = 'fw-bold';

function UserInfo({ userState }) {

  const fetcher = useFetcher();
  //用戶資料狀態
  const [normalInfo, setNormalInfo] = useState({ ...userState.normalInfo });
  //開啟編輯模式
  const [edit, setEdit] = useState(true);
  //更新上傳成功緩存資料
  useUpdateForm(normalInfo, edit);

  return (
    <>

      <Table responsive
        className='mt-4 border shadow p-3 mb-5 bg-body-tertiary rounded' >
        <tbody>
          <tr>
            <td className='position-relative'>
              <h4 className={fontStyle}>用戶資訊</h4>

              <Form fetch={{ normalInfo, setNormalInfo, fetcher, userState, setEdit, edit }} />

            </td>
          </tr>
          <tr>
            <td >
              <h4 className={fontStyle}>醫療部門</h4>
              {userToKeys.medicalInfo(userState.medicalInfo).length ?
                userToKeys.medicalInfo(userState.medicalInfo) : '尚無資料'}
            </td>
          </tr>
          <tr>
            <td>
              <h4 className={fontStyle}>其他</h4>

              {userToKeys.restInfo(userState.restInfo).length ?
                userToKeys.restInfo(userState.restInfo) : '尚無資料'}

            </td>
          </tr>
        </tbody>
      </Table>


    </>

  )
}








export default memo(UserInfo);
