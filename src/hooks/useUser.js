import { userInitial } from '@store';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { createToast } from '@utils/systemToastify';
function useUser() {
  const navigator = useNavigate();
  const { data, isSuccess, isFetching, status ,fetchStatus} = useQuery({
    queryKey: ['userCtx'],
    queryFn: async () => {
      let res = await fetch(`${import.meta.env.VITE_VAR_BASE_URL}/authentication`
        , {
          credentials: 'include',
          mode: 'cors',
          method: 'GET'
        },
      )

      if (res.status == 401) {
        createToast('登入逾時，請重新登入!',{
          position:'top-center',
          type:'warning',
          theme:'colored'
        })

        navigator('/sign-in');
        return;
      }
      const user = await res.json();
      const normalizedUser = userInitial(user.msg);
      return normalizedUser
    },
    retry:1,
    retryDelay:1500,
    refetchOnWindowFocus: true,
  })
  return { data, isSuccess, isFetching, status, fetchStatus }
}

export default useUser;