
import { useMutation } from '@tanstack/react-query';


function useEditGroup(queryClient, page, operations, { initialToast, updateFetchToast, deleteFetchToast, errorFetchToast }) {
  const { mutate } = useMutation({
    mutationFn: async ({ newData }) => {
      if (operations.type === 'DELETE') {
        const { user_id } = newData;
        fetch(`${import.meta.env.VITE_VAR_BASE_URL}/employees/${user_id}`, {
          method: 'DELETE',
          credentials: 'include',
          mode: 'cors'
        }).then((res) => res.text());
      }
      if (operations.type === 'UPDATE') {
        const { normalInfo, medicalInfo } = newData;
        console.log(normalInfo)
        const data = { ...normalInfo, user_password: normalInfo.user_password, ...medicalInfo }
        delete data.uuid;
        if (['MRI002', 'CT002'].includes(medicalInfo.position_id)) {
          data.role_uid = 1;
        } else {
          data.role_uid = 2;
        }
        const res = await fetch(`${import.meta.env.VITE_VAR_BASE_URL}/employees/${data.user_id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
          credentials: 'include',
          mode: 'cors'
        });
        if (!res.ok) {
          const json = await res.json();
          throw new Error(json.msg);

        }

      }
      return operations;
    },

    onMutate: async ({ newData, operation }) => {
      initialToast();
      //中斷其他正在refetch的動作
      await queryClient.cancelQueries({ queryKey: ['employees'] });
      //把舊資料snapShot
      const previousData = queryClient.getQueryData(['employees', page]);
      if (operations.bool) {
        const data = previousData.data;
        let filteredData;
        const operationsType = {
          'DELETE': () => {
            filteredData = data.filter(e => e.user_id !== newData.user_id);
            return { ...previousData, data: filteredData };
          },
          'UPDATE': () => {
            //把當前物件資料分類合併成一個物件
            const combinationArrUserObj = combinationUserFields(newData);
            //找到cache正在編輯的用戶資料，再進行覆蓋
            data.forEach((e, idx, arr) => {
              if (e.user_id == combinationArrUserObj.user_id) {
                arr[idx] = { ...e, ...combinationArrUserObj }
              }
            });
            return { ...previousData, data };
          },

          'DEFAULT': () => previousData
        }
        //更新Query資料
        queryClient.setQueryData(['employees', page], operationsType[operation]());

        //合併新舊資料  
        return { previousData }
      }
      return { previousData }

    },
    onError: (err, newTodo, context) => {
      errorFetchToast();
      queryClient.setQueryData(['employees'], context.previousData);
    },

    onSettled: (operations) => {
      if (operations.type === 'DELETE' && operations.bool) {
        deleteFetchToast();
        return;
      }

      if (operations.type === 'UPDATE' && operations.bool) {
        updateFetchToast();
        return;
      }

    }
  });

  function combinationUserFields(newData) {
    //把當前物件資料分類合併成一個物件
    const values = Object.values(newData);
    const combinationArrUserObj = values.reduce((acc, curr) => ({ ...curr, ...acc }));
    return combinationArrUserObj
  }

  return { mutate, combinationUserFields };
}



export default useEditGroup;