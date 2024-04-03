import { Fragment } from 'react';
import { Form } from 'react-bootstrap';
import moment from 'moment';
import { reversePosition, position_key } from '@utils/positionsKeys';
const regex = /^\w+(\w+)*@\w+([.]\w+)*\.\w+([-.]\w+)*$/;

const fetcherState = {
  idle: false,
  submitting: true,
  loading: true,
}
function InputComponent(key, v, edit, positionName) {
  const editToKeys = {
    user_name: <>
      <input defaultValue={v}
        data-edit={edit}
        readOnly={!edit}
        name="name"
        type="text"
        pattern="[\u4e00-\u9fa5aA-z_a-z_0-9]{1,40}"
        spellCheck
        required
        maxLength="40"
        minLength="1"
        key={'name'} /><p /></>,
    user_mail: <>
      <input defaultValue={v}
        data-edit={edit}
        readOnly={!edit}
        required
        maxLength="40"
        pattern={regex}
        type="email"
        name="mail"
        key={"email"} /><p /></>,
    user_sex:
      <Form.Select name="sex" data-edit={edit} disabled={!edit} key={"sex"}>
        <option defaultValue={v}>{v}</option>
        <option defaultValue="Male">Male</option>
        <option defaultValue="Female">Female</option>
        <option defaultValue="Bisexual">Bisexual</option>
      </Form.Select>,
    user_age: <>
      <input defaultValue={v}
        data-edit={edit}
        readOnly={!edit}
        name="age"
        type="number"
        required
        min="20"
        max="70"
        key={'age'}
      /></>,
    user_phone: <>
      <input defaultValue={v}
        data-edit={edit}
        readOnly={!edit}
        name="phone"
        type="tel"
        required
        pattern="[0-9]{9,10}"
        minLength="9"
        maxLength="10"
        key={"phone"}
      /><p /></>,
    position_name: <>
      <label htmlFor="department" className="d-flex">
        <Form.Select aria-label="部門選擇"
          onChange={(e) => edit({ department_name: position_key[e.target.value].depart, position_id: e.target.value })}
          name="department"
          className="w-100 fw-bold"
          defaultValue={(() => {
            //反轉職位預設值
            if (key === 'position_name') {
              const departmentID = reversePosition[positionName.department_name];
              return departmentID[v];
            }
            return ''
          })()}
        >
          <optgroup label="電腦斷層組(CT)">
            <option value="CT001">醫事放射師</option>
            <option value="CT002">CT組長</option>

          </optgroup>
          <optgroup label="磁振造影組(MRI)">
            <option value="MRI001">醫事放射師</option>
            <option value="MRI002">MRI組長</option>
          </optgroup>
          <optgroup label="專科醫師">
            <option value="MS001">主治醫師</option>
            <option value="MS002">住院醫師</option>
          </optgroup>
        </Form.Select>
      </label></>,
    user_password: <>
      <input id='password'
        type='text'
        name="password"
        className="w-100"
        required
        defaultValue={v}
        autoComplete='off'
        minLength="5"
        maxLength="12"
        placeholder='Re-enter'
      />
    </>


  }

  return editToKeys[key];
}
const userToKeys = {
  //一般資訊
  normalInfo: (param, edit, role) => {
    let userArr = [];
    param = new Map(Object.entries(param));
    param.delete("role_uid");
    const key = {
      user_name: '名稱',
      user_mail: '信箱',
      user_sex: '性別',
      user_age: '年齡',
      user_phone: '電話',
      user_password: '密碼'
    };
    // InputComponent(k, v, edit) : 
    const keys = ['user_id', 'user_oldPassword', 'user_newPassword', 'uuid'];
    param.forEach((v, k) => {
      if (keys.includes(k)) return;
      if (role !== 'admin' && k === 'user_password') return
      userArr.push(<Fragment key={k}>
        <tbody>
          <tr >
            <td className='p-3 fs-5'>
              {
                key[k]
              }</td>
            <td className='p-3' >
              {
                k === 'user_password' ? InputComponent(k, v, edit) : InputComponent(k, v, edit)
              }
            </td>
          </tr>
        </tbody>
      </Fragment>)
    })
    return userArr;
  },
  //醫療資訊
  medicalInfo: (param, role = "", department, setDepartment) => {
    let userArr = [];
    param = new Map(Object.entries(param));
    const key = {
      department_name: '部門',
      position_name: '職稱',
      position_id: '部門ID',
      reports: '報告量'
    }

    param.forEach((v, k) => {

      userArr.push(<Fragment key={k}>
        <tbody>
          <tr  >
            <td className='p-3 fs-5'>
              {role === 'admin' ? `目前${key[k]}` : key[k]}
            </td>
            <td className='p-3' >
              {
                role === 'admin' ? <>
                  {InputComponent(k, v, setDepartment, department) ?? department[k]}
                </> : v
              }
            </td>
          </tr>
        </tbody>
      </Fragment>)
    })
    return userArr;
  },
  //其他資訊
  restInfo: (param) => {
    let userArr = [];
    param = new Map(Object.entries(param));
    const key = {
      user_register_time: '註冊時間',
      lastTimeLogin: '上次登入時間',
      lastTimeUpdate: '上次更新時間'
    }
    param.forEach((v, k) => {
      if (/Invalid/.test(v) || v === undefined || v === null) {
        v = <span className='text-secondary'>尚未登記</span>;
      } else {
        let ISO = new Date(v).toISOString();
        v = moment(ISO).format('YYYY-MM-DD, h:mm:ss a');
      }


      userArr.push(<Fragment key={k}>
        <tbody>
          <tr>
            <td className='p-3 fs-5'>{key[k]}</td>
            <td className='p-3 ' >
              {v}
            </td>
          </tr>
        </tbody>
      </Fragment>)
    })
    return userArr;
  }
}



export { userToKeys, fetcherState }
