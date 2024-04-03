import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import moment from 'moment';
import EditDropdown from '../EditDropdown';
import { Media } from 'react-data-table-component';
import { Figure } from '@assets/styled';
import {sex,role} from '@utils/sexKeys';


const customStyles = {
  responsiveWrapper: {
    style: {
      zIndex:'10'
    }
  },
  table: {
    style: {
      minHeight: '50dvh',
    },
  },

  rows: {
    style: {
      minHeight: '60px',
    },
  },
  headCells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  },
  contextMenu:{
    style:{
      zIndex:'100'
    }
  },
  cells: {
    style: {
      paddingLeft: '8px',
      paddingRight: '8px',
    },
  }

};
function getColumns(page) {
  const columns = [
    {
      name: 'ID',
      selector: row => {
        if (row.uuid) return row.uuid.slice(0, 8);
        return row.uuid
      },
      hide: Media.MD,
      compact: true
    },
    {
      cell: row => {

        return (
          <Figure bg={sex[row.user_sex.toUpperCase()].color}>
            {row.user_name.charAt(0)}
          </Figure>
        )
      },
      hide: Media.SM,
      width: '50px',
      left: true,
      compact: true
    },
    {
      name: '用戶名稱',
      selector: row => row.user_name,
      sortable: true,
      reorder: true,

    },
    {
      name: '報告量',
      selector: row => row.reports ?? '無',
      sortable: true,
      reorder: true,
      hide: Media.SM,
      width: '10%',
      minWidth: '50px',
      compact: true
    },
    {
      name: '部門',
      selector: row => row.department_name,
      sortable: true,
      reorder: true,
      hide: Media.MD,
      width: '10%',
      minWidth: '50px',
      compact: true
    },
    {
      name: '職稱',
      selector: row => row.position_name,
      sortable: true,
      reorder: true,
    },
    {
      name: '權限',
      selector: row => role[row.role_uid],
      sortable: true,
      reorder: true,
      width: '5%',
      minWidth: '50px',
      compact: true
    },
    {
      name: '性別',
      selector: row => sex[row.user_sex.toUpperCase()].text,
      sortable: true,
      reorder: true,
      width: '10%',
      minWidth: '50px',
    },
    // {
    //   name: '註冊時間',
    //   selector: row => new Date(row.user_register_time).toLocaleDateString(),
    //   sortable: true,
    //   reorder: true,
    //   hide: Media.MD,
    //   style: {
    //     color: 'rgba(0, 0, 0, 0.54)'
    //   }
    // },
    {
      name: '上次登入',
      selector: row => {

        const timeString = moment(row.lastTimeLogin);

        const timeValid = /Invalid\b/i.test(timeString);
        return (
          <>
            <OverlayTrigger
              placement={'bottom'}
              overlay={
                <Tooltip id={`tooltip-${row.uuid}`}>
                  <time dateTime={`${timeString.format('YYYY-MM-DD')}`}>
                    {timeString.format('h:mm:ss a')}
                  </time>.
                </Tooltip>
              }
            >
              <div variant="secondary">
                {
                  timeValid ? '尚未登記' : timeString.format('YYYY-MM-DD')
                }
              </div>
            </OverlayTrigger>
          </>
        )
      },
      sortable: true,
      reorder: true,
      hide: Media.MD,
      style: {
        color: 'rgba(0, 0, 0, 0.54)'
      }
    },
    {

      cell: (row) => <EditDropdown userData={row} page={page} />,
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },

  ];


  return columns
}

export { getColumns, customStyles }