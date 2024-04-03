import React, { useState, useEffect } from 'react';
import { Form, useActionData, useOutletContext } from 'react-router-dom';
import { Form as BsForm,Button } from 'react-bootstrap';
import { MdAccountBox, MdPassword } from "react-icons/md";
import { AiOutlineProfile, AiFillMail, AiFillEyeInvisible, AiFillEye, AiFillMedicineBox } from "react-icons/ai";
import { BsFillTelephoneFill } from "react-icons/bs";
import style from "@style";

//紀錄當前表單資料，進行持久化
let signUpForm = {
  Name: '',
  email: '',
  phone: '',
};

export default function Register({ Title, service, location }) {
  const authCheckMsg = useActionData();

  const [Navigate, setRegisterConfirm] = useOutletContext();
  const genders = ["Male", "Bisexual", "Female"];
  const [TelInit, setTelInit] = useState('');
  const [visible, setVisible] = useState(false);

  const preFormData = JSON.parse(localStorage.getItem('signUpForm') ?? '{}');


  //關閉錯誤提示
  useEffect(() => {
    if (preFormData?.phone) {
      setTelInit(preFormData?.phone);
    }
    //註冊通過轉導登入頁面
    if (authCheckMsg?.msg == 'ok' && service !== 'admin') {
      setRegisterConfirm('sign-in');
      Navigate(authCheckMsg?.page, { replace: true });
      return;
    }

  }, [authCheckMsg])


  const handleTelChange = (event) => {
    const value = event.target.value.replace(/[\WA-Za-z_]/, '');
    setTelInit(value)
  };
  return (
    <>
      <Form method="post" action={(location ? location : "/sign-up")}
        className={style.login}
        onKeyDown={preventSpaceKeyDown}

        onChange={(e) => {
          signUpForm[e.target.id] = e.target.value;
        }}
      >
        <p className='text-center fs-1 fw-bold' >
          {
            Title ?? <>
              Register
              <AiOutlineProfile className="fs-3" />
            </>
          }

        </p>
        <label htmlFor="Name" className="text-center">
          <MdAccountBox />
          <input id='Name'
            type="text"
            name="name"
            placeholder='Name / 名稱'
            className="w-100"
            spellCheck
            required
            maxLength="40"
            defaultValue={preFormData?.Name}
          />
        </label>
        <label htmlFor="department" className="d-flex">
          <AiFillMedicineBox />
          <BsForm.Select aria-label="部門選擇"
            name="department"
            className="w-100 fw-bold" style={{ textIndent: "30px" }}>
            <optgroup label="電腦斷層組(CT)">
              <option value="CT001">放射師</option>
              <option value="CT002">CT組長</option>

            </optgroup>
            <optgroup label="磁振造影組(MRI)">
              <option value="MRI001">放射師</option>
              <option value="MRI002">MRI組長</option>
            </optgroup>
            <optgroup label="專科醫師">
              <option value="MS001">主治醫師</option>
              <option value="MS002">住院醫師</option>
            </optgroup>
          </BsForm.Select>
        </label>
        <label htmlFor="email" className="text-center">
          <AiFillMail />
          <input id='email'
            type="text"
            name="email"
            placeholder='Email'
            className="w-100"
            required
            maxLength="40"
            defaultValue={preFormData?.email}
          />
        </label>
        <div style={{ display: 'grid', position: 'relative' }}>
          <label htmlFor="password" className="text-center">
            <MdPassword />
            <input id='password' type={visible ? 'text' : 'password'} name="password"
              className="w-100"
              required
              autoComplete='current-password'
              minLength="5"
              maxLength="12"
              placeholder='Password'

            />

          </label>
          <span onClick={() => setVisible(!visible)} style={{ position: 'absolute', right: '0%', zIndex: '6', cursor: 'pointer' }} >
            {visible ? <AiFillEye style={{ border: 'none' }} /> : <AiFillEyeInvisible style={{ border: 'none' }} />}
          </span>
        </div>

        <label htmlFor="confirmPassword" className="text-center">
          <MdPassword />
          <input id='confirmPassword'
            type='password'
            name="confirmPassword"
            className="w-100"
            required
            autoComplete='off'
            minLength="5"
            maxLength="12"
            placeholder='Re-enter'
          />
        </label>

        <label htmlFor="phone" className="text-center">
          <BsFillTelephoneFill />
          <input id='phone'
            type='tel'
            name="phone"
            className="w-100"
            required
            minLength="9"
            maxLength="9"
            placeholder='+886-xxxxxxxxx'
            value={TelInit}
            onInput={handleTelChange}

          />
        </label>



        <input id='age' type='number' name="age"
          pattern="\d*"
          min="20"
          max="70"
          placeholder='年齡'
        />
        <tbody>
          <tr className={style.gender}>
            {
              genders.map((e, index) => {
                return (
                  <th key={index} >
                    <label
                      htmlFor={e}
                    >{e}</label>
                    <input id={e}
                      type="radio"
                      name="gender"
                      value={e}
                    />
                  </th>
                )
              })
            }
          </tr>
        </tbody>

        <span></span>
        <span></span>
        <div>
          <Button 
          type="submit"
          variant="light"
          className='text-black'
          >註冊</Button>
          <Button type="reset" 
            variant="light"
            className='text-black'
          onClick={resetForm(setTelInit)}>重置</Button>
        </div>



      </Form>
    </>
  )


}

function resetForm(setTelInit) {

  return () => {

    let entriesForm = Object.entries(signUpForm);
    entriesForm.forEach(e => e[1] = '');
    let fromEntriesForm = Object.fromEntries(entriesForm);
    signUpForm = fromEntriesForm
    localStorage.setItem('signUpForm', JSON.stringify(signUpForm));
    setTelInit('');
  }
}

function preventSpaceKeyDown(e) {
  //限制空格符號輸入
  if (e.key !== undefined) {
    e.code = e.key;
  } else if (e.keyIdentifier !== undefined) {
    e.code = e.keyIdentifier;
  } else if (e.keyCode !== undefined) {
    e.code = e.keyCode;
  }
  if (/\s/.test(e.code)) {
    e.preventDefault()
  }
}
