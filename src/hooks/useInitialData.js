import { useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchData } from '../utils/FileProcess/fetchData';


export function useInitialData(folderKeys, dirName) {

  //placeHolder不會進入cache，作為fetching中的過渡
  const placeholderData = useMemo(() => [{
    filename: '', text: 'Loading....'
  }], [])

  const { data, isSuccess, isFetching } = useQuery({
    queryKey: folderKeys(dirName.api),
    queryFn: fetchData(dirName.api),
    placeholderData,
    refetchOnWindowFocus: true,
    keepPreviousData: true,
    retry: 2,
    staleTime: 0,
  })



  return { data, isSuccess, isFetching }


}