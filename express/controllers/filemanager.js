const fsPromise = require('fs/promises');
const fs = require('fs')
const path = require('path');
const { Readable } = require('stream');
const process = require('../utils/fileSplit');

class FileManagerController {
  constructor(fileService) {
    this._fileService = fileService;

  }
  /**
   * 格式化報告資料
   */
  preProcess = async (req, res) => {
    res.header('Content-Type', 'application/json');
    const { name } = req.body;
    const depart = req.query.depart;
    //獲取過濾後的POST資料
    const file = req.files['file'][0];
    const originFile = fs.readFileSync(file.path);
    const data = originFile.toString('utf-8');
    let jsonString;


  
    
    //原始資料進行格式化
    if (depart === 'RADIOLOGY') {
      jsonString = JSON.stringify(process(data, file.originalname), null, 2);
    } else {
      //非放射報告格式的資料直接緩存
      jsonString = JSON.stringify(data, null, 2);
    }

    //用stream方式進行讀寫
    const readableStream = new Readable({
      read() {
        this.push(jsonString);
        this.push(null);
      }
    });

    readableStream.pipe(fs.createWriteStream(file.path, 'utf-8'))
      .on('finish', () => {
        //結束後返回檔案參數
        res.send({ fileName: file.filename, name });
        console.log('緩存完成!');
      })
      .on('error', (err) => {
        console.error('錯誤讀寫!', err);
      });


  }
  /**
   * 瀏覽所有部門報告數量
   */
  browseDocs = async (req, res) => {
    const result = await this._fileService.browse();
    res.status(result.status).send(result);
  }


  /**
   * 新增部門報告資料
   */
  addNewDoc = async (req, res) => {

    const { file } = req;
    const split = file.buffer.toString('utf-8').split('$');

    const reports = JSON.parse(split[0]);
    const privateInfo = JSON.parse(split[1]);

    const result = await this._fileService.upload(reports, privateInfo);

    res.status(200).send(result.data);
  }

  /**
   * 獲取單一部門資料
   */
  getDocs = async (req, res) => {
    const { params: { department }, query } = req;
    const docs = await this._fileService.read(department, query.fileId);

    res.status(docs.status).send(docs.data);
  }

  /**
   * 更新部門資料
   */
  updateDoc = async (req, res) => {
    const { params: { department }, file } = req;
    const jsonReport = JSON.parse(file.buffer.toString('utf-8'));
    const docs = await this._fileService.update(jsonReport, department);
    res.status(docs.status).send(docs);
  }
  /**
   * 刪除預格式化後緩存在Server的資料
   */
  deleteDisk = async (req, res) => {
    res.header('Content-Type', 'plain/text');
    const { params } = req;

    if (params.id == 'all') {
      const folderPath = path.join(__dirname, '../temp/uploads/');
      try {
        const files = await fsPromise.readdir(folderPath);
        if (files.length === 0) {
          res.status(200).send('Folder is empty.');
          return
        }
        const deleteFilePromises = files.map(file =>
          fsPromise.unlink(path.join(folderPath, file)),
        );
        await Promise.allSettled(deleteFilePromises);
        console.log('緩存資料已全部刪除.');
        res.status(200).send('緩存資料已全部刪除.');
        return;
      } catch (error) {
        console.error('Error deleting folder:', err);
        res.status(500).send('Error deleting folder');
        return;
      }
    }

    res.send('123')
  }
}


module.exports = FileManagerController;