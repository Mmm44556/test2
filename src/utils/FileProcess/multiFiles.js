
// import { postData } from "./fetchData";
// import zip from "./zip";
// onmessage = async (e) => {
//   const { fileList, file, path } = e.data;
//   const currentPath = [...path];
//   currentPath.push(file.text)

//   const strCurrentPath = currentPath.join('\\')
//   uploadChange(fileList, strCurrentPath)

// }
// function Done(file, folderName) {
//   return new Promise((resolve, reject) => {
//     let reader = new FileReader();
//     reader.onload = (e) => {
//       let reportContent = e.target.result;
//       let obj = dataProcess(reportContent, file.name, folderName);
//       resolve(obj)
//     }
//     reader.onerror = () => {
//       console.log('<!請確保檔案類型正確!>', reader.error);
//       reject(reader.error)
//     }
//     reader.readAsText(file);
//   })
// }

// const reg = new RegExp(/.zip/, 'i');

// async function uploadChange(fileList = [], folderName = "") {

//   if (reg.test(fileList[0].name)) {
//     fileList = await zip(fileList);
//   }



//   let filesArray = [...fileList];

//   let objArray = [];
//   for (let i = 0; i < filesArray.length; i++) {
//     const res = await Done(filesArray[i], folderName);
//     objArray.push(res)
//   }
//   //存放處理完後的資料當作json傳輸(包括切割失敗的)
//   let errorFiles = objArray.filter(e => e.state == 'error');
//   let readyFiles = objArray.filter(e => {
//     e['type'] = 'multi';
//     return e.state == 'ready'
//   });
//   readyFiles.forEach(e => {
//     let path = e.name.split('/');
//     let len = path.length;
//     if (!(len > 1)) return;
//     let fileName = path.pop();
//     let folderPath = path.join('\\')
//     let fullPath = e.folder.concat('\\', folderPath)
//     e.name = fileName;
//     e.folder = fullPath;

//   })
//   const final = {
//     originFiles: objArray,
//     errorFiles,
//     readyFiles,
//     upload: []
//   }


//   if (final.readyFiles == 0) postMessage({ ...final });
//   let uploadedFiles = postData(final.readyFiles)
//   uploadedFiles.then(r => r.json())
//     .then(r => postMessage({ ...final, upload: r }))

// }










//----------------資料處理開始-----------------------//



//json檔案宣告
function dataProcess(originData = "", filename = "", folderName = "") {

  try {
    //用於儲存段落關鍵字
    let keyword = "";
    // 正則表達式 選取對象，於開頭的 "任意文字:" (含大小寫) or 任何含AJCC的行
    const reg2 = /^.*imp.*\:|.*ajcc.*|.*findings.*|.*impression.*:/img;
    //再把各段落切出來
    let section = originData.split(reg2);
    //最後要輸出出去的json物件
    let jsonObject = { "name": filename, "data": [] };
    //先抓出段落關鍵字
    keyword = originData.match(reg2);
    //將keyword反轉，防止文件有額外說明
    keyword.reverse();
    section.forEach((item, index, arr) => {
      arr[index] = item.split('\r\n');
    })
    //將非換行字元提出
    let r = /^\s*$/;
    section.forEach((item, index, arr) => {
      arr[index] = item.filter((item2) => {
        if (!(r.test(item2))) return item2;
      })
      jsonObject.data.push({ "Type": 'additional', "Sentences": arr[index] });
    });
    keyword.forEach((e, index, arr) => {
      let i = arr.length - index;
      jsonObject.data[i].Type = e;
    })
    return jsonObject;
  } catch (e) {
    // console.log(`${filename}資料處理失敗，請確保格式內容!`);
    return { text: filename, state: 'error', path: folderName, info: '資料處理失敗，請確保格式內容!' };
  }

}

function downloadJSON(json, name) {
  
    const jsonString = JSON.stringify(json, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });

    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    const splitName = name.split('.');
  link.download = splitName[0] + '.json';
    document.body.appendChild(link);
    link.click();

    URL.revokeObjectURL(url);
    document.body.removeChild(link);
    return 1

 
}

//----------------資料處理結束-----------------------//

export { dataProcess, downloadJSON }


