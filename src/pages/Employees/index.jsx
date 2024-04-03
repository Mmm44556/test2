import { useState, useEffect } from 'react';
import { Form, Spinner, Button, Placeholder, OverlayTrigger, Tooltip, Tab, Tabs } from 'react-bootstrap';
import DataTable from 'react-data-table-component';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { IoAnalytics } from "react-icons/io5";
import { BiSortAlt2 } from "react-icons/bi";
import { MdPeople } from "react-icons/md";
import { FaUserPlus } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";
import AddMember from './AddMember';
import { getColumns, customStyles } from './js/column';
import { paginationComponentOptions } from './js/keywords';
import { fetchEmployees, useFilterComponent } from './js/paginatorFn';

import styled from 'styled-components';

const ActiveTabs = styled(Tabs)`
.nav-link{
color:#495057;
  &[aria-selected="true"]{
    color:#0d6efd;
    }
}`



export default function Employees() {
  const queryClient = useQueryClient();
  const iniPerPage = 10;
  const [page, setPage] = useState(0);
  const [perPage, setPerPage] = useState(iniPerPage);
  const columns = getColumns(page);

  const {
    isSuccess,
    isFetching,
    dataUpdatedAt,
    isStale,
    data,
    refetch,
    isPreviousData,
  } = useQuery({
    queryKey: ['employees', page],
    queryFn: () => fetchEmployees(page, perPage),
    keepPreviousData: true,
    refetchOnWindowFocus: false,
    retry: 1,

  })


  //資料過濾搜尋
  const { SubHeaderComponentMemo, filteredItems, resetPaginationToggle } = useFilterComponent(data?.data, queryClient);

  //預先獲取下筆資料
  useEffect(() => {
    if (isSuccess) {
      usePrefetch(page, perPage);
    }
  }, [data])

  //修改上下頁
  const handlePage = (page) => {
    if (!isPreviousData) {
      setPage(page - 1)
    }
  }
  //修改當前頁數量
  const handlePerPage = async (perPage, page) => {
    setPerPage(perPage)
    setPage(Math.max(page - 1, 0))
  }

  return (
    <>
      <ActiveTabs
        defaultActiveKey="employees"
        id="justify-tab-example"
        className="mb-3 "

      >
        <Tab eventKey="employees" title={
          <h4 className=' p-0 m-0'>
            <MdPeople className="fs-3" />
            用戶資料
          </h4>
        }>

          <DataTable
            customStyles={customStyles}
            paginationServer
            paginationTotalRows={data?.total ?? iniPerPage}
            onChangePage={handlePage}
            onChangeRowsPerPage={handlePerPage}
            columns={columns}
            data={filteredItems}
            direction="auto"
            title={<Title isStale={isStale}
              isFetching={isFetching}
              refetch={refetch}
              queryClient={queryClient}
              data={{ data, dataUpdatedAt }}
            />}
            noDataComponent={<>
              <h3 className="fw-bold">尚無資料</h3>
            </>}
            highlightOnHover
            responsive
            pagination
            progressPending={isFetching}
            paginationPerPage={perPage}
            paginationResetDefaultPage={resetPaginationToggle}
            paginationComponentOptions={paginationComponentOptions}
            paginationRowsPerPageOptions={[iniPerPage, 20]}
            contextMessage={{ singular: '筆資料', plural: '筆資料' }}
            progressComponent={<LoadingProgress length={7} />}
            persistTableHead
            pointerOnHover
            subHeader
            subHeaderAlign="right"
            subHeaderWrap
            subHeaderComponent={SubHeaderComponentMemo}
            selectableRows
            selectableRowsHighlight
            selectableRowsComponent={Form}
            sortIcon={<BiSortAlt2 />}
          />

        </Tab>
      </ActiveTabs>
    </>
  );

  async function usePrefetch(page = 0, perPage = 10) {
    await queryClient.prefetchQuery({
      queryKey: ['employees', (page + 1)],
      queryFn: () => fetchEmployees((page + 1), perPage),
    })

  }
}
function Title({ isStale, isFetching, queryClient, refetch, data: { data, dataUpdatedAt } }) {
  return (
    <div className='d-flex justify-content-between'>
      <h6 className='d  flex-row align-items-center p-0 m-0 text-secondary'>
        <div className='d-inline-block'>上次刷新時間: {new Date(dataUpdatedAt).toLocaleString()}</div>
        <div>系統註冊人數:{data?.total ?? 0}人</div>
      </h6>

      <h3 className='d-flex flex-row align-items-center p-0 m-0 gap-2'>
        <Overlay hint={'+Add member'}>

          <AddMember isFetching={isFetching}>
            <FaUserPlus className='me-1' />
            新增用戶
          </AddMember>

        </Overlay>
        <Overlay hint={'Refresh'}>
          <Button variant="light"
            disabled={isFetching}
            onClick={() => {
              queryClient.cancelQueries({ queryKey: ['employees'] })
              refetch();
              if (isStale) {
                queryClient.invalidateQueries({ queryKey: ['employees'] })
              }
            }}>
            刷新資料  <FaArrowRotateLeft />
          </Button>
        </Overlay>

      </h3>
    </div>
  )
}

function LoadingProgress({ length = 4 }) {

  return (
    <>
      <div className='fs-2'>
        <Spinner animation="border" className='me-2' size="" />
        載入中... <Placeholder as="p" animation="glow">
          <Placeholder lg={length} />
        </Placeholder>
      </div>
    </>
  );
}

function Overlay({ children, hint }) {
  return (

    <OverlayTrigger
      placement={'top'}

      overlay={
        <Tooltip>
          <span>{hint}</span>
        </Tooltip>
      }>
      {children}
    </OverlayTrigger>

  )
}