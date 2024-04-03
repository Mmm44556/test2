const key = {
  user_name: '用戶名稱',
  department_name: '部門',
  position_name: '職稱',
  lastTimeLogin: '上次登入',
};


const paginationComponentOptions = {
  rowsPerPageText: '每頁資料:',
  noRowsPerPage: false,
  rangeSeparatorText: 'of',
  selectAllRowsItem: true,
  selectAllRowsItemText: '30',

}
const fetchState = {
  fetching: true,
  idle: false
}

export { key, fetchState, paginationComponentOptions }