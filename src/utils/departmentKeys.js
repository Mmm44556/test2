const type = {
  'Home': {
    title: 'dataList'
  },
  '內科':
  {
    title: 'Internal',
    bg: '#27a844',
    footer: '#24963e',
    gradient: 'rgba(60,213,72,1)',
  },
  '外科': {
    title: 'Surgery',
    bg: '#007aff',
    footer: '#006fe5',
    gradient: 'rgba(51,100,203,1)',
  },
  '骨科': {
    title: 'Orthopedics',
    bg: '#dc3644',
    footer: '#c62f3e',
    gradient: 'rgba(230 35 82,1)',
  },
  '放射科': {
    title: 'Radiology',
    bg: '#6f42c1',
    footer: '#643cae',
    gradient: 'rgba(60,213,72,1)',
  },
  '醫師回覆紀錄': {
    title: 'proposals',
    bg: '#3c8dbc',
    footer: '#367fa8'
  },
  '報告覆閱紀錄': {
    title: 'reviews',
    bg: '#6c757e',
    footer: '#5f686f'
  }
}

const TypeBadges = {
  'ER': {
    str: '急診',
    bg: 'danger',
    color:"#dc3545"
  },
  'OPD': {
    str: '門診',
    bg: 'primary',
    color:'#0d6efd'
  },
  'PE': {
    str: '健檢',
    bg: 'success',
    color:'#198754'
  },
  'MC': {
    str: '體檢',
    bg: 'secondary',
    color:'#6c757d'
  },
  'IP': {
    str: '住院',
    bg: 'warning',
    color:'#ffc107'
  },
  'ALL': {
    str: '全部',
    bg: ''
  }
}
//交換type的title跟key值
function swapKeysAndValues(obj) {
  let swappedObj = {};
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      let title = obj[key].title.toUpperCase();
      let newObj = { ...obj[key] };
      delete newObj.title;
      swappedObj[title] = { ...newObj, title: key };
    }
  }
  return swappedObj;
}

export { type, TypeBadges, swapKeysAndValues }