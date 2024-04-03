/**
 * @File 引入格式化函數
 * 
 */
const { encodeJson } = require('../utils/formatting');


/**
 * 查詢SessionID後返回結果
 * @typedef {object} QueryResult
 * @property {number} QueryResult.status
 * @property {object} QueryResult.msg
 */


/**
 *  處理驗證請求Controller
 */
class AuthenticationController {
  constructor(authenticationService) {
    this.authenticationService = authenticationService;
  }

  /**
    * 處理用戶登入請求並返回登入結果
    * @return {Promise.<object>} 
    */
  login = async (req, res) => {
    res.header('Cache-Control', 'private');

    const { session, sessionID } = req;
    const { name, password } = req.body;
    /**
     * @type {QueryResult}
     */
    const result = await this.authenticationService.login({ name, password, session, sessionID });


    //有返回用戶資料後設置SessionID、用戶資料
    if (result.status == 200) {
      session.sessionID = sessionID;
      session.user = result.msg;
      let encodeStr = encodeJson(result.msg);
      res.status(result.status).send(encodeStr);
      return;
    }
    res.status(result.status).send(result.msg);
  }

  /**
   * 用戶註冊服務
   * @returns {Promise.<object>}
   */
  register = async (req, res) => {

    const result = await this.authenticationService.register(req.body);
 
    res.status(result.status).send(result.msg);
  }

  logout = async (req, res) => {
    const { params, session } = req;
    
    const result = await this.authenticationService.logout(params.id);
    if (result.status == 204) {
      session.destroy(function (err) {
        res.cookie('sid', '', { expires: new Date(0) });
        res.status(result.status).send(result.msg);
      })
    } else {
      res.status(result.status).send(result.msg);
    }

  }

  /**
 * 判斷sessionID是否存在，查詢ID返回用戶資料
 * @return {Promise.<object>} 
 */
  authentication = async (req, res) => {
    const user = req.user;
    const sessionData = req.sessionData;


    //把用戶資料進行轉碼
    let encodeStr = encodeJson(user);

    res.status(sessionData.status).send(encodeStr);

  }


  /**
   * 查詢ID返回用戶資料
   * @return {Promise.<object>} 
   */
  sessionChecker = async (req, res, next) => {
  
    if (req.session.sessionID == undefined) {
      res.status(401).send('@@');
      return;
    }
    if (req._parsedUrl == 'logout') {
      res.status(204);
      return;
    }

    /**
     * @type {QueryResult}
     */
    const sessionData = await this.authenticationService.ValidateSessionID(req);
    // let encodeStr = encodeJson(sessionData);
    console.log('-------------')
    res.status(200).send(sessionData);


  }


}


module.exports = AuthenticationController;