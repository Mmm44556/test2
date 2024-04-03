import { useQuery, useMutation } from '@tanstack/react-query';

//獲取所屬部門資料
function useTypeFiles(type = "", fileId = "") {
  if (fileId === undefined) {
    return
  }
  const UpperStrType = type.toUpperCase();
  const result = useQuery({
    queryKey: ['department', UpperStrType],
    queryFn: () => fetchFiles(UpperStrType, fileId),
    staleTime: 30000,
    refetchOnWindowFocus:false

  }
  )
  return result;
}

function useTypePrefetch(type, lastIndexId, queryClient) {
  const UpperStrType = type.toUpperCase();

  queryClient.prefetchQuery({
    queryKey: ['department', UpperStrType, 'next'],
    queryFn: () => fetchFiles(UpperStrType, lastIndexId),
    staleTime: 0
  }
  )
}

//獲取特定病患資料底下的所有報告
function useTypeReports(queryClient) {
  const typeReportsMutate = useMutation({
    mutationFn: async ({ fileId, department }) => {
      const reports = await fetchFiles(department, fileId);
      return { reports, department, fileId };
    },
    onMutate: async () => {
      await queryClient.cancelQueries({ queryKey: ['department'] });
      return;
    },
    onSuccess: async ({ reports, department, fileId }) => {
      const currentDepartment = queryClient.getQueryData(['department', department]);
      //當前選擇的檔案進行報告更新
      const filteredReports = currentDepartment.map(e => {
        if (e.fileId === fileId) {
          e.reports = reports;
        }
        return e;
      });
      queryClient.setQueryData(['department', department], filteredReports);
      return 
    }
  })

  return typeReportsMutate;
}

async function fetchFiles(UpperStrType, lastIndexId = '') {

  const files = await fetch(`${import.meta.env.VITE_VAR_BASE_URL}/dataList/${UpperStrType}?fileId=${lastIndexId}`, {
    method: 'GET',
    headers: {
      "Accept": "application/json"
    }
  });

  return await files.json();
}
export { useTypeFiles, useTypePrefetch, useTypeReports };