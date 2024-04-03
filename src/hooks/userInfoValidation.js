

function useInfoValidation(setNormalInfo, userState) {
  //控制表單值
  const normalInfoChange = (setNormalInfo) => (event) => {
    const { name, value } = event.target;
    setNormalInfo(prev => {//修改當前值
      //age欄位手輸入超過限制
      if (name == "age" && value.length > 2) return prev;
      return ({ ...prev, [`user_${name}`]: value })
    });
  }
  //重置用戶資料
  const resetUserInfo = () => setNormalInfo({ ...userState.normalInfo })
  
  return { resetUserInfo, normalInfoChange }
  
}

export { useInfoValidation } ;