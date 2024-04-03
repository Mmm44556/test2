
const express = require('express');
let router = express.Router();
const multer = require('multer');
const { resolve } = require('path');

const preLoader = multer({
  dest: resolve(__dirname, '../temp/uploads'),
  fileFilter: (req, file, cb) => {
    if (!file.originalname.match(/\.(txt|json|zip)/)) {
      cb(new TypeError('請上傳.txt或.json檔案!'))
    }
    cb(null, true);
  }
});
const uploader = multer();
const FilesRepository = require('../models/files');
const FileManagerService = require('../services/FileManager');
const FileManagerController = require('../controllers/filemanager');

const fileManagerService = new FileManagerService(new FilesRepository());
const fileManagerController = new FileManagerController(fileManagerService);




/**
 * 用戶資料BREAD
 */


//預格式化報告資料
router.post('/dataList/preProcess?', preLoader.fields([{ name: 'file' }]), fileManagerController.preProcess);

router.get('/dataList', fileManagerController.browseDocs);

router.post('/dataList', uploader.single('response'), fileManagerController.addNewDoc);

router.get('/dataList/:department?', fileManagerController.getDocs);

router.delete('/dataList/:id', fileManagerController.deleteDisk);

router.put('/dataList/:department', uploader.single('response'), fileManagerController.updateDoc);






module.exports = router;