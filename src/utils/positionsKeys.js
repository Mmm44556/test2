const reversePosition = {
  '電腦斷層組': {
    '醫事放射師': 'CT001',
    'CT組長': 'CT002'

  },
  '磁振造影組': {
    '醫事放射師': 'MRI001',
    'MRI組長': 'MRI002'
  },
  '專科': {
    '主治醫師': 'MS001',
    '住院醫師': 'MS002'
  }
}
const position_key = {
  'CT001': {
    depart: '電腦斷層組',
    position: '醫事放射師'
  },
  'CT002': {
    depart: '電腦斷層組',
    position: 'CT組長'
  },
  'MRI001': {
    depart: '磁振造影組',
    position: '醫事放射師'
  },
  'MRI002': {
    depart: '磁振造影組',
    position: 'MRI組長'
  },
  'MS001': {
    depart: '專科',
    position: '主治醫師'
  },
  'MS002': {
    depart: '專科',
    position: '住院醫師'
  },
}

export { reversePosition, position_key }