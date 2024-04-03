
const selection = [
  {
    title: '---類別---',
    name:"type",
    values: {
      'ER': '急診',
      'OPD': '門診',
      'PE': '健檢',
      'MC': '體檢',
      'IP': '住院'
    },
    default: 'OPD'

  },
  {
    title: '---檢查方法---',
    name:"inspection",
    values: {
      'CT': 'CT',
      'MRI': 'MRI'
    },
    default: 'CT'
  },
  {
    title: '---部門---',
    name:'department',
    values: {
      'INTERNAL': '內科',
      'SURGERY': '外科',
      'ORTHOPEDICS': '骨科',
      'RADIOLOGY': '放射科'
    },
    default: 'INTERNAL'
  }
]
const parts = [
  {
    title: '---部位---',
    name:'parts',
    values: {
      'LIVER': 'Liver-肝',
      'CHEST': 'Chest-胸腔',
      'KIDNEY': 'Kidney-腎',
      'LIVER_TRANSPLANT': 'Liver Transplant-肝臟移植',
      'SPLEEN': 'Spleen-脾臟'
    },
    default: 'none'
  }
]

export { parts, selection }