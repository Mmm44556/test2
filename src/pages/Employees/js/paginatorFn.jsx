import { useState, useMemo } from 'react';
import SearchBar from '@layouts/SearchBar';


//獲取員工資料
function fetchEmployees(page = 0, perPage = 10) {
  return fetch(`${import.meta.env.VITE_VAR_BASE_URL}/employees?per_page=${perPage}&page=${page}`, {
    method: 'GET',
    credentials: 'include',
    mode: 'cors'
  }).then((res) => res.json())
}

//過濾功能
function useFilterComponent(data = [], queryClient) {
  const [filterKeyWord, setFilterKeyWord] = useState('user_name');
  const [filterText, setFilterText] = useState('');
  const [resetPaginationToggle, setResetPaginationToggle] = useState(false);
  const user = queryClient.getQueryData(['userCtx']);
  const name = user.normalInfo;

  //過濾輸入資料，每次輸入都會執行
  const filteredItems = data.filter(
    item => item[filterKeyWord] && item[filterKeyWord].toLowerCase().includes(filterText.toLowerCase()) && !(item['user_name'].includes(name.user_name))
  );

  //輸入框組件
  const SubHeaderComponentMemo = useMemo(() => {
    const filterHandler = (e) => {
      if (filterText) {
        setResetPaginationToggle(!resetPaginationToggle);
        setFilterText('');
      }
      setFilterText(e.target.value)
    };
    return (
      <SearchBar filterHandler={filterHandler}
        filterKeyWord={filterKeyWord}
        setFilterKeyWord={setFilterKeyWord} />);
  }, [filterText, resetPaginationToggle, filterKeyWord]);

  return { SubHeaderComponentMemo, filteredItems, resetPaginationToggle }
}

export { fetchEmployees, useFilterComponent }