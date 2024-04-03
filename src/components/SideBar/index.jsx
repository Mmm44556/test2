
import { Nav } from "react-bootstrap";
import { useLocation, useNavigate } from 'react-router-dom';
import { MdDashboardCustomize, MdAccountBox, MdPeople, MdAnalytics } from "react-icons/md";
import { IoIosMail } from "react-icons/io";
import { GrSystem } from "react-icons/gr";
import { FaCloudUploadAlt } from "react-icons/fa";

function SideBar({ userState }) {

  const { normalInfo } = userState;

  let url = useLocation(); //匹配當前路由
  url = url.pathname.split('/');
  return (
    <Nav defaultActiveKey="dataList" variant="pills" activeKey={url[2]} className="flex-column" as="ul">
      <Nav.Item as="li" className="text-center p-2">
        <Nav.Link eventKey="dataList"
          onClick={useNavigator('dataList', {})}
          title="dataList"
          className="fs-4">
          <GrSystem className="fs-4" />
          <span className="ms-2 fs-5">RIS-System</span>

        </Nav.Link>
      </Nav.Item>
      <hr />
      {/* <Nav.Item as="li">
        <Nav.Link
          onClick={useNavigator('uploader')}
          eventKey="uploader"
          title="uploader">
          <FaCloudUploadAlt /> 上傳報告
        </Nav.Link>
      </Nav.Item> */}
      <Nav.Item as="li">
        <Nav.Link
          onClick={useNavigator('dataList')}
          eventKey="dataList"
          title="dataList">
          <MdDashboardCustomize />檔案列表
        </Nav.Link>
      </Nav.Item>
      <Nav.Item as="li">
        <Nav.Link
          onClick={useNavigator(`user/${normalInfo.user_id}`)}
          eventKey="user"
          title="user">
          <MdAccountBox />個人資料
        </Nav.Link>
      </Nav.Item>
      {normalInfo.role_uid == 1 ? <Nav.Item as="li">
        <Nav.Link
          onClick={useNavigator('employees')}
          eventKey="employees"
          title="employees">
          <MdPeople />用戶資料
        </Nav.Link>
      </Nav.Item>
        : null}
      <hr />
    </Nav>
  )
}
function useNavigator( location, options={replace:false} ) {
  const navigator = useNavigate();


  return () => navigator(location, {...options});

}

export default SideBar;