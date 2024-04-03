import { memo } from 'react';
import { MdAccountBox, MdPassword } from "react-icons/md";
import { AiFillMail } from "react-icons/ai";
import { RxCross2 } from "react-icons/rx";
import style from "../../assets/scss/style.module.scss";
function AuthCheck({ authCheck }) {
  const icons = {
    'account': <MdAccountBox />,
    'password': <MdPassword />,
    'mail': <AiFillMail />,
    'rest': <RxCross2 />

  }
  console.log('authCheck:', authCheck);
  return (
    <>
      {
        authCheck ? <div
          aria-live="polite"
          aria-atomic="true"
          className={style.authCheck}
        > <p>
            {icons[authCheck.icon]}
            {authCheck.msg}
          </p>
        </div> : null
      }
    </>
  );
}


export default memo(AuthCheck);