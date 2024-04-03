const fs = require('fs')
const JSZip = require("jszip");
module.exports = function (zipFilePath) {
  return new Promise((resolve, reject) => {


    fs.readFile(zipFilePath.path, function (err, data) {


      JSZip.loadAsync(data).then(function (zip) {
        console.log(zip)
      })
    })


    return ''
    JSZip.loadAsync(zipStream).then(function (zip) {
      // 迭代压缩包中的文件
      zip.forEach(function (relativePath, file) {
        console.log('Extracting file:', relativePath);

        // 创建文件写入流
        const writeStream = fs.createWriteStream(`${extractToDir}/${relativePath}`);

        // 通过管道将文件内容从 zip 文件流写入到目标文件
        file.nodeStream().pipe(writeStream);
      });
    }).then(function () {
      console.log('Extraction completed.');
    }).catch(function (err) {
      console.error('Error extracting zip file:', err);
    });

    // let reader = new FileReader();

    // reader.onload = function (e) {

    //   //非同步讀取zip
    //   JSZip.loadAsync(e.target.result).then(async function (zip) {

    //     //回傳zip物件，將values轉為陣列
    //     let obj = Object.values(zip.files)
    //     //dir的blob也會存在，過濾掉dir的blob
    //     let noDirArr = obj.filter((file) => !file.dir)
    //     let arr = []
    //     //解壓zip後轉成blob再生成FILE物件給FileReader讀取文件內容
    //     for (let i = 0; i < noDirArr.length; i++) {
    //       let GeneratedBlob = await zip.files[noDirArr[i].name].async('blob')
    //       let FILE = new File([GeneratedBlob], noDirArr[i].name, { type: 'text/plain' })
    //       arr.push(FILE)
    //     }
    //     resolve(arr)
    //   }).catch(function (err) {
    //     alert('請選擇資料夾!')
    //     console.error(` 不屬於zip檔案or不支持加密zip!`);
    //     zipFiles.target.value = "";
    //   })
    //   //     reader.onerror = function (err) {
    //   //         console.error(`壓縮檔讀取失敗，請確保資料夾檔案正確!${err}`);
    //   // }


    // }
    // reader.readAsArrayBuffer(zipFiles[0]);
  })
}


// const fs = require('fs');
// const JSZip = require('jszip');

// // 读取压缩文件
// fs.readFile('example.zip', function (err, data) {
//   if (err) {
//     console.error('读取文件失败:', err);
//     return;
//   }

//   // 使用 JSZip 解析压缩文件
//   JSZip.loadAsync(data).then(function (zip) {
//     // 遍历压缩文件中的文件列表
//     zip.forEach(function (relativePath, zipEntry) {
//       console.log('解压文件:', relativePath);

//       // 将文件内容转换为可读流
//       const readableStream = zipEntry.nodeStream();

//       // 创建可写流并将文件内容通过管道写入本地文件
//       const writableStream = fs.createWriteStream(relativePath, 'utf-8');
//       readableStream.pipe(writableStream);

//       writableStream.on('finish', () => {
//         console.log('成功写入文件:', relativePath);
//       });

//       writableStream.on('error', (err) => {
//         console.error('错误读写!', err);
//       });
//     });
//   }).catch(function (err) {
//     console.error('解压文件失败:', err);
//   });
// });
