import { forwardRef, useState, useEffect, useMemo } from 'react'
import { Dropdown, Button, DropdownItem, Container, Row, Col, Form } from 'react-bootstrap';
import { useQueryClient } from '@tanstack/react-query';
import { MdAutoDelete } from "react-icons/md";
import { BsThreeDotsVertical, BsWrench } from "react-icons/bs";
import { FaUser } from "react-icons/fa";

import AdditionalInfo from '@components/AdditionalInfo';
import NormalCard from '@layouts/NormalCard';
import UserContainer from '@layouts/UserContainer';
import UserCard from '@layouts/UserCard';
import { role } from '@utils/sexKeys';
import { userToKeys } from '@hooks/userToKey';
import useEditGroup from '@hooks/useEditGroup';
import userInitial from '@store/userInitial';
import { createToast, dismissToast } from '@utils/systemToastify';
import moment from 'moment';
import styled from 'styled-components';



const EnhButton = styled(Button)`
border:none;
transition:all 0.3s ease-out;

svg{
font-size:1.4rem;
transition:inherit;
transform:${(({ open }) => open ? 'rotate(-90deg)' : '')}

}
&:hover{
  background:#859cb1d1;
}
`
const EnhDropdown = styled(DropdownItem)`
font-weight:bold;
padding-right:0;
padding-top:0;
svg{
margin-right:5px;
}`
const TdElements = styled.table`
width:100%;
--fontSize:1.1rem;
--fontWeight:600;
--fontColor:#6d6d6d;

tr{
  margin:0px;
  border-bottom:1.3px solid #dadada;


  td{
    text-align:left;
    padding:8px !important;
    &:first-child{
    font-weight:700 !important;
    }
    &:last-child{
      display:flex;
      align-items:center;
      border:none;
      font-size:var(--fontSize);
      font-weight:var(--fontWeight);
      color:var(--fontColor);
    }
  input{
    border:none;
    font-size:var(--fontSize);
    font-weight:var(--fontWeight);
    color:var(--fontColor);
  }
  }
}

`

const CustomToggle = forwardRef(({ children, onClick, setIsOpen }, ref) => {
  return (
    <a
      href=""
      ref={ref}
      onClick={(e) => {
        e.preventDefault();
        setIsOpen(v => !v)
        onClick(e);
      }}
    >
      {children}
    </a>
  )
});


const CustomMenu = forwardRef(
  ({ children, style, className, 'aria-labelledby': labeledBy, show, setIsOpen }, ref) => {
    useEffect(() => {
      if (!show) {
        setIsOpen(false)
      }
    }, [show])
    return (
      <div
        ref={ref}
        style={{ ...style, transform: "translateX(-25%)",zIndex:'200' }}
        className={`${className} `}
        aria-labelledby={labeledBy}
      >
        <ul className="list-unstyled m-0 text-start ">
          {
            children
          }
        </ul>
      </div>
    );
  },
);

//Middle ware詢問鍵，確定是否編輯操作
function confirmResult(user_name, context, setOperations, hint) {
  let result = confirm(`${context} ${user_name}`);
  setOperations({ type: hint, bool: result });
  return result;
}
//編輯Modal's Header
function Header({ currentEditUser }) {
  const { role_uid } = currentEditUser.normalInfo;
  return (
    < >人員資料修改-<FaUser className='fs-5  align-baseline' />
      Role_Group:<Button
        variant={(role_uid == 1 ? 'danger' : 'primary')}
        as="div"
        className='m-1 fw-bold user-select-none'

      >
        {role[role_uid]}</Button>
      <div className='d-inline-block text-secondary'>
        上次更新:
        {
          new Date().toLocaleString()
        }
      </div>
    </>
  )
}
const EMPId = 'employee';
const initialToast = () => {

  createToast(<span>{`處理中...!`}</span>, {
    type: 'info',
    isLoading: true,
    theme: 'colored',
    position: "top-right",
    autoClose: 2000,
    toastId: EMPId
  })
};
const updateFetchToast = () => {
  dismissToast(EMPId);
  createToast(<span>{`更新成功! ${moment().format('hh:mm:ss a')}`}</span>, {
    type: 'success',
    theme: 'colored',
    position: "bottom-left",
    autoClose: 3000,
    delay: 1000
  })
};
const deleteFetchToast = () => {
  dismissToast(EMPId);
  createToast(<span>{`刪除成功! ${moment().format('hh:mm:ss a')}`}</span>, {
    type: 'error',
    theme: 'colored',
    position: "bottom-left",
  })
};
const errorFetchToast = () => {
  dismissToast(EMPId);
  createToast(<span>{`發生錯誤! ${moment().format('hh:mm:ss a')}`}</span>, {
    type: 'error',
    theme: 'colored',
    position: "bottom-left"
  })
}

export default function EditDropdown({ userData, page }) {

  const editUser = useMemo(() => userInitial(userData), [userData]);

  const [currentEditUser, setCurrentEditUser] = useState(editUser);

  const [open, setIsOpen] = useState(false);
  //操作Mutation狀態
  const [operations, setOperations] = useState({ type: 'DEFAULT', bool: false });
  const [department, setDepartment] = useState({ department_name: currentEditUser.medicalInfo.department_name, position_id: currentEditUser.medicalInfo.position_id });
  const queryClient = useQueryClient();
  const { mutate, combinationUserFields } = useEditGroup(queryClient, page, operations, { updateFetchToast, deleteFetchToast, errorFetchToast, initialToast });

  const submitUpdateUserDate = (e) => {
    if (confirmResult(currentEditUser.normalInfo.user_name, '確定修改該筆資料?', setOperations, 'UPDATE')) {
      mutate({ newData: currentEditUser, operation: 'UPDATE' });
    }


  }
  const resetUpdateUserDate = () => {
    //編輯用戶未修改的話重置
    const employeesData = queryClient.getQueryData(['employees', page]).data;
    const defaultUserData = employeesData.filter(e => e.user_id === userData.user_id);
    setCurrentEditUser(userInitial(defaultUserData[0]));
  }

  return (
    <Dropdown>
      <Dropdown.Toggle as={CustomToggle} setIsOpen={setIsOpen} id="dropdown-custom-components">
        <EnhButton variant="outline-secondary" open={open}>
          <BsThreeDotsVertical />
        </EnhButton>

      </Dropdown.Toggle>

      <Dropdown.Menu
        as={CustomMenu}
        setIsOpen={setIsOpen}>
        <EnhDropdown eventKey="1"
        >
          <UserContainer
            title={<> <BsWrench className='text-secondary me-1 ' />編輯</>}
            header={<Header currentEditUser={currentEditUser} />}
            resetUpdateUserDate={resetUpdateUserDate}
          >

            <Container>
              <form
                onChange={(e) => {
                  //捕獲輸入修改當前User資料狀態
                  let inputTag = `user_${e.target.name}`;
                  const value = e.target.value;
                  const combinationUserField = combinationUserFields(currentEditUser);

                  if (inputTag === 'user_department') inputTag = 'position_id';
                  const updateDate = userInitial({ ...combinationUserField, [inputTag]: value });

                  setCurrentEditUser(() => updateDate);

                }}
              >


                <Row >

                  <Col lg={3}>
                    <Col>

                      <UserCard
                        userState={currentEditUser}
                        Figure={null}
                        role={'admin'}
                        save={submitUpdateUserDate}
                        cardHeight={'100dvh'}
                      />
                    </Col>

                  </Col>

                  <Col lg={9} className="text-nowrap">
                    <Col>
                      <NormalCard
                        subtitle={currentEditUser.normalInfo.uuid}
                        second={0.6}
                        delay={0.1}
                      >
                        <TdElements>
                          {
                            userToKeys.normalInfo(currentEditUser.normalInfo, setCurrentEditUser, 'admin')
                          }
                        </TdElements>
                      </NormalCard>
                    </Col>
                    <Row>
                      
                      <Col>
                        <NormalCard
                          subtitle={<AdditionalInfo ToolText={
                            '注意!保存後才一併修改'} />}
                          second={2}
                          delay={0.5}
                        >
                          <TdElements >
                            {
                              userToKeys.medicalInfo(currentEditUser.medicalInfo, 'admin', department, setDepartment)
                            }
                            {
                              userToKeys.restInfo(currentEditUser.restInfo)
                            }
                          </TdElements>
                        </NormalCard>
                      </Col>
                    </Row>

                  </Col>
                </Row>

              </form>
            </Container>

          </UserContainer>
        </EnhDropdown>

        <EnhDropdown eventKey="2"
          onClick={(e) => {
            if (confirmResult(userData.user_name, '確定刪除該筆資料?', setOperations, 'DELETE')) {

              mutate({ newData: userData, operation: 'DELETE' })
            }


          }}>
          <MdAutoDelete className='text-danger' />
          刪除
        </EnhDropdown>
      </Dropdown.Menu>
    </Dropdown>
  );
}


