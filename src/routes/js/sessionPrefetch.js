
import { redirect } from "react-router-dom";

async function sessionCheck(props) {
  try {
    let res = await fetch(`${import.meta.env.VITE_VAR_BASE_URL}/authentication`, {
      method: 'GET',
      credentials: 'include',
      mode: 'cors',
    },
    )

    if (res.status == '200') return redirect('/DashBoard/dataList')
    return null;
  } catch (error) {
    return null;
  }

}


export { sessionCheck }