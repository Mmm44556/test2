import { createToast, updateToast } from '@utils/SystemToastify';
function deleteDisk(id) {
  //刪除緩存區所有文件
  return fetch(`${import.meta.env.VITE_VAR_BASE_URL}/dataList/${id}`, {
    method: 'DELETE',
    credentials: 'include',
  });

}
function preProcessFiles(files, { department, title }) {
  //檢查是否為zip或者單筆
  const detectedTitle = title == undefined ? files[0].name : `${title}.json`;
  //先將拖曳區文件給server格式化後，緩存在server
  const uploadPromises = files.map((file) => {
    const formData = new FormData();
    formData.append(`file`, file, detectedTitle);
    formData.append('name', file.name);
    return fetch(`${import.meta.env.VITE_VAR_BASE_URL}/dataList/preProcess?depart=${(department || 'INTERNAL')}`, {
      method: 'POST',
      body: formData,

    });
  });

  return uploadPromises;
}

function preProcessPromises(uploadPromises, droppedFiles, setFiles, setResponse) {
  //處理預格化後的結果
  let id = createToast('資料格式化...', {
    isLoading: true,
    theme: "dark"
  })

  Promise.allSettled(uploadPromises).then(result => {
    let resMap = result.map((res) => {
      if (res.status === 'fulfilled') {
        // Promise 成功解析时，返回解析结果
        return res.value.json();
      } else {
        // Promise 被拒绝时，返回拒绝原因
        return Promise.reject(res.reason);
      }
    })
    return Promise.all(resMap);
  }).then(e => {
    //格式化結束後，可開始上傳
    setFiles(droppedFiles);
    setResponse(e)
    updateToast(id, {
      render: '格式化完成! 可開始進行上傳。',
      isLoading: false,
      type: 'success',
      theme: 'dark',
      autoClose: 5000
    })
  })
}

function uploadFiles(response) {
  //上傳檔案至server端
  const formData = new FormData();
  formData.append('response', response, '.json');

  return fetch(`${import.meta.env.VITE_VAR_BASE_URL}/dataList`, {
    method: 'POST',
    body: formData,

  });
}

export { preProcessFiles, deleteDisk, uploadFiles, preProcessPromises };