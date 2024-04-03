import { useEffect } from 'react';
import { useQueryClient } from '@tanstack/react-query';


//提交成功後將緩存的用戶資料更新
const useUpdateForm = (normalInfo, edit) => {
  const queryClient = useQueryClient();
  useEffect(() => {

    if (!edit) {
      const user = queryClient.getQueryData(['userCtx']);
      const submittedForm = normalInfo;
      const mutationUser = { ...user, normalInfo: { ...submittedForm } };
      queryClient.setQueryData(['userCtx'], mutationUser);
    }
  }, [edit])
}






export { useUpdateForm }