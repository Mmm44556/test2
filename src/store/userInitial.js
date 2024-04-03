
function userInitial(user = '') {

  //初始化用於處理登入

  let { user_name, user_sex, user_age, user_phone, user_mail, role_uid, user_register_time, department_name, position_name,position_id, lastTimeLogin, lastTimeUpdate, user_id,user_password
  } = user;


  let normalInfo = { user_name, user_sex, user_age, user_mail, user_phone, role_uid, user_id, user_password };
  let medicalInfo = { department_name, position_name, position_id };
  let restInfo = { user_register_time, lastTimeLogin, lastTimeUpdate };
  

  if (Object.hasOwn(user, 'uuid')) {
    normalInfo.uuid = user.uuid;
  }

  const initial = { normalInfo, medicalInfo, restInfo }


  return initial
}
//轉換base64密碼，如轉換過就返回原始值
function decodeBase64(password) {
  try {
    return atob(password);
  } catch (error) {

    return btoa(password);
  }
}


export default userInitial 