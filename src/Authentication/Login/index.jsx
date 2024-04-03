import { useEffect, useState } from 'react';
import { Form, useActionData, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import { MdAccountBox, MdPassword } from "react-icons/md";
import style from "../../assets/scss/style.module.scss";
export default function Login() {
  const response = useActionData();
  const navigator = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  useEffect(() => {
    if (response?.msg == 'ok') {
      navigator('/DashBoard/dataList',{replace:true});
      setIsSubmitting(false);
    }
    if(response?.msg=="err"){
      setIsSubmitting(false);
    }
  }, [response])
  return (
    <>

      <Form method="post"
        onSubmit={() => setIsSubmitting(true)}
        action="/sign-in" className={`${style.login} d-flex flex-column gap-2 justify-content-center `}>
        <p className='text-center fs-1 fw-bold' >
          Radiology File System</p>

        <label htmlFor="name" className="text-center">
          <MdAccountBox />
          <input id='name' type="text" name="name" placeholder='Name'
            className="w-100"
            spellCheck
            required
            maxLength="40" />
        </label>

        <label htmlFor="password" className="text-center">
          <MdPassword />
          <input id='password' type="password" name="password"
            className="w-100"
            required
            minLength="0"
            maxLength="12"
            placeholder='password' />
        </label>

        <div >
          <Button
            variant="light"
            className='text-black  w-100'
            disabled={isSubmitting}
            type="submit">
              {
              isSubmitting ? "登入中..." : '登入'
              }
            </Button>
        </div>

      </Form>
    </>
  )
}
