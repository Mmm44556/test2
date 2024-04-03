/**
 * 將時間編碼成格式化字符串
 * @param {object} date 時間物件
 * @return {object}
 */
const moment = require('moment');
function formatDateTime() {
  //對時間格式化，用於儲存資料庫
  let formattedDate = moment().format('YYYY-MM-DD h:mm');
  let formattedExpiresDate = moment().add(2, 'hours').format('YYYY-MM-DD h:mm:ss');
  return { formattedDate, formattedExpiresDate };
}

/**
 * 將物件資料編碼成字符串
 * @param {object} jsonData 資料物件
 * @return {string}
 */
function encodeJson(jsonData) {
  //編碼成base64進行傳輸
  const jsonStr = JSON.stringify(jsonData);
  const encoder = new TextEncoder();
  const encodedData = encoder.encode(jsonStr);
  const base64Encoded = btoa(String.fromCharCode.apply(null, encodedData));
  return base64Encoded
}


module.exports = { formatDateTime, encodeJson };