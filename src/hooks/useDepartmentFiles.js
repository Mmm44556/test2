import { useQuery, useMutation } from '@tanstack/react-query';
import { createToast } from '@utils/systemToastify';
import moment from 'moment';
//獲取所有報告分類數量
function useDepartmentFiles() {

  const result = useQuery({
    queryKey: ['department_Reports'],
    queryFn: async () => {
      const res = await fetch(`${import.meta.env.VITE_VAR_BASE_URL}/dataList`
        , {
          method: 'GET',
          headers: {
            "Accept": "application/json"
          }
        },
      )
      return await res.json();
    },
    initialData: () => {

      return ({
        data: [{ INTERNAL: 0 },
        { SURGERY: 0 },
        { ORTHOPEDICS: 0 },
        { RADIOLOGY: 0 },
        { PROPOSALS: 0 },
        { REVIEWS: 0 }]
      })

    }
  })
  return result;
}

function userClone(user) {
  const cloneUser = structuredClone(user);
  const { medicalInfo, normalInfo } = cloneUser;
  delete normalInfo['user_age'];
  delete normalInfo['user_id'];
  const now = moment().format('YYYY-MM-DD h:mm:ss');
  return { medicalInfo, normalInfo, now }
}

//更新所有報告分類數量
function updateDepartmentReportsCounts(queryClient) {
  const mutate = useMutation({
    mutationFn: async ({ department, count }) => {
      const upperCaseD = department.toUpperCase();
      const departmentReports = queryClient.getQueryData(["department_Reports"]);
      const updatedDepartments = departmentReports.data.map(e => {
        if (Object.hasOwn(e, upperCaseD)) {
          return { [upperCaseD]: e[upperCaseD] + count };
        }
        return e;
      })
      queryClient.setQueryData(["department_Reports"], { status: '200', data: updatedDepartments });
      return updatedDepartments;
    },
    onMutate: async () => {

    },
    onSuccess: async () => {
      console.log('更新完成')
    }
  })
  return mutate;
}
//更新當前部門底下的特定病患資料
function useUpdatedAllReport(queryClient) {
  const mutate = useMutation({
    mutationFn: async ({ oldData, currentData, proposalContext, user }) => {
      const { data } = oldData;
      const { proposalCtx, reviewCtx, state } = currentData;

      //提出回覆才新增回覆
      if (state.proposal) {
        const { medicalInfo, normalInfo, now } = userClone(user);
        proposalCtx.push({
          content: proposalContext,
          path: `${data.department}/${currentData.name}`,
          time: now,
          proposer: {
            medicalInfo,
            normalInfo
          }
        })
      }

      if (state.review) {
        const { medicalInfo, normalInfo, now } = userClone(user);
        const hasCurrentUser = reviewCtx.some(e => e.reviewer.normalInfo.uuid == normalInfo.uuid);
        //判斷review是否有當前用戶，防止每次都新增覆閱資料
        if (!hasCurrentUser) {

        }
        reviewCtx.push({
          path: `${data.department}/${currentData.name}`,
          time: now,
          type: data.type,
          inspection: data.inspection,
          parts: data.parts,
          reviewer: {
            medicalInfo,
            normalInfo
          }

        })
      }
      const updatedData = {
        ...oldData,
        reports: [{
          ...currentData,
          proposalCtx,
          reviewCtx,

        }]
      }
      //轉換成blob存入FORM格式
      const jsonForm = JSON.stringify(updatedData);
      const blobRes = new Blob([jsonForm], { type: 'application/json' });
      const formData = new FormData();
      formData.append('response', blobRes, '.json');

      const result = await fetch(`${import.meta.env.VITE_VAR_BASE_URL}/dataList/${data.department}`
        , {
          method: 'PUT',
          headers: {
            "Accept": "application/json"
          },
          body: formData,
        },
      );
      const jsonResult = await result.json();
      if (jsonResult.status == 200) {
        return jsonResult
      }
      throw new Error(jsonResult.msg);

    },
    onMutate: async ({ oldData, proposalContext }) => {
      const data = queryClient.getQueryData(['department', oldData.data.department]);
      const filteredData = data.map(e => {
        if (e.fileId == oldData.fileId) {
          const { data } = oldData;
          return { ...oldData, data: { ...data, date: { ...data.date, update: moment().format('YYYY-MM-DD h:mm') } } };
        }
        return e
      });

      queryClient.setQueryData(['department', oldData.data.department], filteredData);
      createToast(`資料更新中...`, {
        type: 'info',
        theme: 'colored',
        position: "bottom-right",
        autoClose: 3500
      });

      return filteredData;
    },
    onSuccess: async (res) => {
      createToast(res.msg, {
        type: 'success',
        theme: 'colored',
        position: "bottom-right",
        autoClose: 4000
      });
    },
    onError: async (err) => {
      createToast(err.message, {
        type: 'error',
        theme: 'colored',
        position: "bottom-right",
        autoClose: 5000
      });
    }
  })
  return mutate;
}
//反轉Department的Key value資料
function reCategory(data) {

  const categories = {
    INTERNAL: '內科',
    SURGERY: '外科',
    ORTHOPEDICS: '骨科',
    RADIOLOGY: '放射科',
    PROPOSALS: '醫師回覆紀錄',
    REVIEWS: '報告覆閱紀錄',
  };

  const medicalCategories = ['內科', '外科', '骨科', '放射科'];
  const adminCategories = ['醫師回覆紀錄', '報告覆閱紀錄'];

  const result = {
    medical: [],
    admin: [],
  };

  data.forEach(item => {
    const key = Object.keys(item)[0];
    const value = item[key];
    if (key in categories) {
      const category = categories[key];
      if (medicalCategories.includes(category)) {
        result.medical.push({ category, value });
      } else if (adminCategories.includes(category)) {
        result.admin.push({ category, value });
      }
    }
  });

  const resultArray = Object.values(result);


  return resultArray;
}

export { useDepartmentFiles, updateDepartmentReportsCounts, useUpdatedAllReport, reCategory };