const md5 = require('crypto-js/md5')
/**
 *  處理用戶資料存取Controller
 */
class EmployeeController {
  constructor(userService) {
    this._userService = userService;

  }

  /**
   * 
   * 瀏覽系統內部所有用戶
   */
  browse = async (req, res) => {
    res.header('Cache-Control', 'private');
    const { query } = req;
    const result = await this._userService.browse(query);
    res.status(result.status).send(result)
  }

  read = async (req, res) => {

  }

  /**
*修改用戶資料
* @return {Promise.<object>} 
*/
  update = async (req, res) => {
    const { body, params } = req;

    const result = await this._userService.update({...body}, params);

    res.status(result.status).send(result.msg);
  }

  /**
* 處理用戶更新並返回更新結果
* @return {Promise.<object>} 
*/
  edit = async (req, res) => {

    const { body, session, sessionID } = req;
    const result = await this._userService.edit({ body, session, sessionID });
    console.log(result)
    res.status(result.status).send(result)
  }


  add = async (req, res) => {
    const { body } = req;
    const result = await this._userService.add(body);
    res.status(result.status).send(result.msg);
  }

  delete = async (req, res) => {
    const { params } = req;
    console.log(params)
    const result = await this._userService.delete(params.id);
    // console.log('刪除結果:', result);
    res.status(result.status).send(result.msg);

  }







}

module.exports = EmployeeController;