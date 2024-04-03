import Button from 'react-bootstrap/Button';
import OverlayTrigger from 'react-bootstrap/OverlayTrigger';
import Tooltip from 'react-bootstrap/Tooltip';
import { FaRegQuestionCircle } from "react-icons/fa";
function AdditionalInfo({ToolText}) {
  const renderTooltip = (props) => (
    <Tooltip id="button-tooltip" {...props}>
      {ToolText}
    </Tooltip>
  );

  return (
    <OverlayTrigger
      placement="top"
      overlay={renderTooltip}
    >
      <span >
        <FaRegQuestionCircle className='fs-5'/> 
        
        </span>
    </OverlayTrigger>
  );
}

export default AdditionalInfo;