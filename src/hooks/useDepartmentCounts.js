
import { type, swapKeysAndValues } from "@utils/departmentKeys";

function useDepartmentCounts(departmentAll,filterCall=false) {

  const departments = [];
  const departmentCounts = [];
  const departmentBg = [];
  //反轉key value值
  const departmentZh = swapKeysAndValues(type);
  //將部門過濾成陣列作為圖表
  departmentAll.data.forEach(e => {
    const keys = departmentZh[Object.keys(e)[0]];
    if (filterCall){
      if (['PROPOSALS', 'REVIEWS'].includes(Object.keys(e)[0])) return;
    }

    departmentCounts.push(Object.values(e)[0]);
    departments.push(keys.title);
    departmentBg.push(departmentZh[Object.keys(e)[0]].bg);
  })

  return { departments, departmentCounts, departmentBg }
}

export { useDepartmentCounts }