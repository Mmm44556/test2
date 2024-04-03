
function dataProcess(originData = "", filename = "") {

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
      // console.log(i)
      jsonObject.data[i].Type = e;
    })
    return jsonObject;
  } catch (e) {
    // console.log(`${filename}資料處理失敗，請確保格式內容!`);
    return { text: filename, state: 'error', info: '資料處理失敗，請確保格式內容!' };
  }

}

module.exports = dataProcess;
