import { redirect } from "react-router-dom";
import getRandomHexColor from "@utils/randomColor";
import { createToast, updateToast } from '@utils/systemToastify';
const reg = new RegExp(/[^\u4e00-\u9fa5a-zA-Z0-9]+/i);
const space = new RegExp(/\d/i);
const mail = new RegExp(/^\w+(\w+)*@\w+([.]\w+)*\.\w+([-.]\w+)*$/i);

async function loginAction({ request }) {

  //登入驗證
  const data = await request.formData();
  const loginInfo = new Map(data);
  const submission = { keeping: false }
  loginInfo.forEach((value, key) => {
    if (value == '') return { msg: '登入欄位不可空!', icon: 'rest' };
    submission[key] = value;
  })
  try {
    let res = await fetch(`${import.meta.env.VITE_VAR_BASE_URL}/api/sign-in`, {
      method: 'POST',
      body: JSON.stringify(submission),
      credentials: 'include',
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (res.status == '200') {
      return { msg: 'ok' };
    }
    const result = await res.text();
    createToast(result, {
      theme: 'colored',
      type: 'error',
      position: 'bottom-left',
    })
    return { msg: 'err' }

  } catch (error) {
    console.log(error)


    return null;
  }



}

async function saveUserInfoAction({ request, params }) {

  const form = await request.formData();
  const UpdatedUserInfo = new Map(form);
  let UserInfoJson;
  UpdatedUserInfo.forEach((v, key, map) => {
    v.trim();
  })
  UserInfoJson = Object.fromEntries(UpdatedUserInfo);

  let toastId = createToast('儲存中...', {
    isLoading: true,
    theme: 'light',
  })

  let res = await fetch(`${import.meta.env.VITE_VAR_BASE_URL}/employees/${UserInfoJson.user_id}`, {
    method: request.method,
    credentials: 'include',
    body: JSON.stringify(UserInfoJson),
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json',
    },
  })

  if (res.status == 409) {
    updateToast(toastId, {
      type: 'error',
      render: '保存失敗',
      autoClose: 4000,
    });

    return { status: res.status, msg: '保存失敗' };

  }

  updateToast(toastId, {
    render: '儲存成功',
    type: 'success',
    isLoading: false,
    autoClose: 4000,
  });

  return { status: res.status, msg: '儲存成功' };

}



async function registerAction({ request }) {

  const data = await request.formData();
  const dataMap = new Map(data);
  const submission = {};
  dataMap.forEach((value, key) => {
    submission[key] = value;
  })

  //send post here(api)
  if (reg.test(submission.name)) {
    createToast('姓名禁止@,!~<%等特殊字元!', {
      theme: 'colored',
      position: "bottom-left",
      type: 'error',
    })
    return { msg: '姓名禁止@,!~<%等特殊字元!', icon: 'account' }
  }
  if (!mail.test(submission.email)) {
    createToast('信箱格式錯誤...', {
      theme: 'colored',
      type: 'error',
      position: "bottom-left",
    })
    return { msg: '信箱格式錯誤!', icon: 'mail' }
  }
  if (!space.test(submission.age)) {
    createToast('請填入年齡!', {
      theme: "colored",
      type: 'error',
      position: "bottom-left",
    })
    return { msg: '請填入年齡!', icon: 'rest' }
  }
  if (submission.gender == null) {
    createToast('請填選性別!', {
      theme: 'colored',
      type: 'error',
      position: "bottom-left",
    })
    return { msg: '請填選性別!', icon: 'rest' }
  }
  if (submission.password !== submission.confirmPassword) {
    createToast('請確認密碼是否相同!', {
      theme: 'colored',
      type: 'error',
      position: "bottom-left",
    })
    return { msg: '請確認密碼是否相同!', icon: 'password' }
  }
  const uuid = crypto.randomUUID();
  delete submission.password
  submission.uuid = uuid;

  let res = await fetch(`${import.meta.env.VITE_VAR_BASE_URL}/api/sign-up`, {
    method: 'POST',
    body: JSON.stringify(submission),
    headers: {
      'Content-Type': 'application/json'
    }
  })
  if (!res.ok) {
    createToast(await res.text(), {
      theme: 'colored',
      type: 'error',
      position: "bottom-left",
    })
    return { msg: '', info: '', page: '' };
    ;
  }
  localStorage.setItem('figure', getRandomHexColor());
  createToast('註冊成功!', {
    theme: 'colored',
    type: 'success',
    position: "bottom-left",
  })
  return { msg: 'ok', info: '註冊成功!', page: 'sign-in' };


}

export { loginAction, registerAction, saveUserInfoAction }