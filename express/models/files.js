
const firestoreDB = require('../mysql/firebase');
const firestore = require('firebase/firestore');

const { formatDateTime } = require('../utils/formatting');
const { addDoc, collection, doc, setDoc, query, where, deleteDoc, getDocs, orderBy, getCountFromServer, limit, runTransaction } = firestore;


/**
* 檔案物件
* @typedef {object} File
* @property {string} UID 上傳者uid
* @property {string} owner 上傳者名稱
* @property {string} title  病例號
* @property {string} patient 病患姓名
* @property {string} department 部門(內科、外科、骨科、放射科)
* @property {string} type 檔案類型(門診、健檢、急診、住院、體檢)
* @property {string} parts 檢查部位
(Liver、Chest、Kidney、Spleen、Liver Transplant) 
* @property {string} inspection  檢查方法(CT、MRI)
* @property {object} description 額外描述
* @property {object} state.proposal 狀態:
完成、未完成、醫師提出是否回覆
* @property {object} state.review 是否被列入覆閱工作
* @property {array} group 訪問權限
* @property {object} date 額外描述
* @property {object} date.created 創建時間
* @property {string} date.deadline 剩餘時間
* @property {string} date.update 更新時間
*/




class IFilesRepository {

  connectDB() {

    return this._firestoreDB = firestoreDB;
  }
  /**
   * 瀏覽各部門報告描述
   */
  browseDocs = async () => {

  }
  /**
   * 新增報告
   * @param {array} readAllFile 要新增的資料陣列 
   * @param {*} privateInfo 上傳者資訊描述
   */
  addNewDoc = async (readAllFile, privateInfo) => {

  }
  /**
   * 讀取部門報告
   * @param {string} type 部門類型
   */
  readDoc = async (type) => {

  }

  /**
 * 更新部門報告
 * @param {object} jsonReport 更新後的報告資料 
 *  @param {string} department 部門類型
 */
  updateDoc = async (jsonReport, department) => {

  }
}


class FilesRepository extends IFilesRepository {
  constructor() {
    super();
    this.connectDB();
  }


  browseDocs = async () => {
    //查詢所有部門報告數量
    const result = ['INTERNAL', 'SURGERY', 'ORTHOPEDICS', 'RADIOLOGY', "PROPOSALS", "REVIEWS"].map(async (e) => {
      const depart = firestore.collection(firestoreDB, e);
      const num = (await getCountFromServer(depart)).data().count;

      return { [e]: num };
    })
    return result
  }


  addNewDoc = async (readAllFile, privateInfo, reports) => {
    const { permission } = privateInfo;
    let time = privateInfo.deadline ?? "";
    if (Object.hasOwn(privateInfo, 'deadline')) {
      delete privateInfo.deadline;
    }
    const group = permission ? ["editor", "visitor"] : ["editor"];
    const { formattedDate } = formatDateTime();
    // const data = privateInfo.department == "RADIOLOGY" ? { ...e } : e;
    //預設屬性
    const mergePrivateInfo = {
      ...privateInfo,
      group,
      date: {
        deadline: time,
        update: "",
        created: formattedDate
      }
    }
    const department = await addDoc(collection(firestoreDB, privateInfo.department), { ...mergePrivateInfo });
    const docRef = doc(firestoreDB, privateInfo.department, department.id);
    const subCollection = collection(docRef, 'data');
    const responses = readAllFile.map(async (e, idx) => {
      await addDoc(subCollection,
        {
          e,
          name: reports[idx].name,
          state: {
            proposal: false,
            review: false
          },
          proposalCtx: [],
          reviewCtx: []
        })
      return '';
    });
    return responses;
  }

  readDoc = async (type, id) => {

    try {

      if (id) {
        const reports = [];
        //查詢該筆檔案的全部報告
        const currentReportDocRef = doc(firestoreDB, type, id);
        const reportCollection = await getDocs(collection(currentReportDocRef, 'data'));
        for (const report of reportCollection.docs) {
          reports.push({ ...report.data(), fileId: report.id });
        }
        return { status: 200, data: reports }

      } else {
        const docs = [];
        let departmentDocs = query(collection(firestoreDB, type)
        );
        const docsSnapShots = await getDocs(departmentDocs);
        for (const e of docsSnapShots.docs) {
          const data = e.data();
          docs.push({ data, fileId: e.id, reports: [] });
        }
        return { status: 200, data: docs };
      }

    } catch (error) {
      console.log(error);
      return { status: 500, data: error };
    }
  }

  updateDoc = async (jsonReport, department) => {
    const { fileId, data, reports } = jsonReport;
    const { formattedDate } = formatDateTime();
    const parentDocRef = collection(firestoreDB, department);
    const currentDepartmentDoc = doc(parentDocRef, fileId);
    return runTransaction(firestoreDB, async transaction => {
      // 获取父文档数据
      const parentDocSnapshot = await transaction.get(currentDepartmentDoc);
      if (!parentDocSnapshot.exists) {
        throw new Error('Document does not exist!');
      }
  
      // 获取子集合文档
      const childCollectionRef = collection(currentDepartmentDoc, 'data')
      if (reports[0].state.proposal) {
        const proposalCollectionRef = collection(firestoreDB, 'PROPOSALS');
        await setDoc(doc(proposalCollectionRef, reports[0].fileId), { ...reports[0], department: 'PROPOSALS' });
      }
      if (reports[0].state.review) {
        //新增覆閱資料
        const reviewCollectionRef = collection(firestoreDB, 'REVIEWS');
        await setDoc(doc(reviewCollectionRef, reports[0].fileId), { ...reports[0], department: 'REVIEWS' });

      }
      // 更新父文档数据
      transaction.update(currentDepartmentDoc, {
        ...data, date: {
          ...data.date,
          update: formattedDate
        }
      });
      // 更新子集合的特定檔案
      await setDoc(doc(childCollectionRef, reports[0].fileId), reports[0]);
    });
  }

}





module.exports = FilesRepository;