const fs = require('fs');
const path = require('path');
class FileManagerService {
  #filesRepository;
  constructor(filesRepository) {
    this.#filesRepository = filesRepository;
  }

  browse = async () => {
    const result = await this.#filesRepository.browseDocs();

    try {
      const resolves = await Promise.all(result);
      return { status: 200, data: resolves };
    } catch (error) {
      return { status: 500, data: error };
    }

  }


  upload = async (reports, privateInfo) => {

    const readAllFile = reports.map(e => {
      //讀取緩存檔案陣列
      const files = fs.readFileSync(path.resolve(__dirname, '../temp/uploads/', e.fileName))
      return JSON.parse(files.toString('utf-8'));
    })
    const promisesArray = await this.#filesRepository.addNewDoc(readAllFile, privateInfo, reports);
    return promisesArray;
  }

  read = async (type, fileId) => {
    const docsArray = await this.#filesRepository.readDoc(type, fileId);
    return docsArray;

  }

  update = async (jsonReport, department) => {

    try {
      await this.#filesRepository.updateDoc(jsonReport, department);
      return { status: 200, msg: '更新成功!' };
    } catch (error) {
      return { status: 500, msg: '資料更新時出錯了!' };
    }

  }
  download() {

  }
  delete() {

  }
}



/**檔案追蹤的詳細描述
 * @typedef {object} Description 
 * @property {string} description.name - 名稱  
 * @property {string} description.event 發生事件 
 * @property {string} description.identifier 唯一識別符  
 * @property {string} description.department 部門 
 * @property {string} description.location  檔案位置
 * @property {string} description.timeStamp  檔案生命週期
 * @property {object} description.own  創建人詳細資訊
*/
/**
 * @class 寫入、讀取檔案日誌
 */
class LogHandler {
  /**
   * @param {Description} description  檔案詳細描述
   */
  constructor(description) {
    this.description = description;

  }
  writeLog() {
  }
  readLog() {
  }
}

module.exports = FileManagerService;