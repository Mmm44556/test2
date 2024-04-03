const zhKeys = {
  title: '標題',
  type: '類型',
  patient: '病患姓名',
  parts: '部位',
  inspection: '方法',
  // department: '部門',
  // owner: '上傳者',
  // date: '日期',
  // group: '權限',
  // state: '檔案狀態'
}

//轉換資料對應中文keys
function reportFieldKeys(obj) {
  const objEntries = new Map(Object.entries(obj))

  const sortedObj = {};
  const sortedKeys = Array.from(objEntries.keys()).sort((a, b) => {
    return Object.keys(zhKeys).indexOf(a) - Object.keys(zhKeys).indexOf(b);
  });

  //調整map順序
  sortedKeys.forEach(key => {
    const chineseKey = zhKeys[key];
    if (chineseKey !== undefined) {
      sortedObj[chineseKey] = objEntries.get(key);
    }
  });
  return Array.from(Object.entries(sortedObj))
}
//進行鍵值反轉
function reverseObject(obj) {
  const reversedObj = {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const value = obj[key];
      reversedObj[value] = key;
    }
  }
  return reversedObj;
}
export { reportFieldKeys, zhKeys, reverseObject }