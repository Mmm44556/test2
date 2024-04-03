import { Badge } from 'react-bootstrap';
import timeRemaining from '@utils/timeRemaining';
import { TypeBadges } from '@utils/departmentKeys';
const customFilesStyles = {
  table: {
    style: {
      minHeight: '50dvh'

    },
  },

  rows: {
    style: {
      minHeight: '45px',
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',

    },
  },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
      marginLeft: '0.3rem',
      marginRight: '0.5rem'

    },
  }

};

const fileColumns = [
  {
    name: '病歷號',
    selector: (row, idx) => row.data.title,
    compact: true
  },
  {
    name: '類別',
    selector: row => {
      const type = TypeBadges[row.data.type]
      return <Badge bg={type?.bg} style={{ fontSize: "1cqi" }} >
        {type?.str}
      </Badge>
    },
    reorder: true,

  },
  {
    name: '姓名',
    selector: row => row.data?.patient,
    reorder: true,
  },
  {
    name: '治療部位',
    selector: row => row.data?.parts||'N/A',
    reorder: true,
  },
  {
    name: '檢查方法',
    selector: row => row.data?.inspection,
    reorder: true,
  },
  {
    name: '剩餘時間',
    selector: row => timeRemaining(row.data.date?.deadline),
    reorder: true,
  }
]
export { fileColumns, customFilesStyles, TypeBadges };