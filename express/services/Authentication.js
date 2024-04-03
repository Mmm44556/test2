
/**
* 註冊用戶屬性
* @typedef {object} UserData
* @property {string} name 
* @property {string} department 
* @property {Number} age 
* @property {string} confirmPassword 
* @property {string} email 
* @property {string} gender 
* @property {Number} phone 
*/


/**
 * 用戶驗證服務模塊
 * 從Controller獲取資料
 * 從Modal將資料過濾進行較驗，再傳回Controller
 */
class AuthenticationService {
  #userRepository;
  constructor(UserRepository) {
    this.#userRepository = UserRepository;
  }


  /**
* 登入驗證
* 身分驗證過程會交由ErrorBoundary處理
* @return {Promise.<object>}  返回查找結果，返回資料層查找DB的結果
*/
  login = async ({ name, password, session, sessionID }) => {

    try {
      /**
       * @type {object} 用戶詳細資料
       */
      const user = await this.#userRepository.getUser(name, sessionID);

      const result = new ErrorBoundary({ user, password });
      const loginResult = result.loginResult();

      return loginResult;
    } catch (error) {
      return { status: 409, msg: error };
    }
  }


  /**
* 註冊驗證
* @param {UserData} userData 表單提交的註冊資料
* @return {Promise.<object>}  返回註冊結果，返回userModal查找是否已存在用戶的結果
*/
  register = async (userData) => {

    try {
     
      const result = await this.#userRepository.createUser(userData);

      if (result) {
        return { status: 200, msg: 'success' };
      }

    } catch (error) {
      let registerResult = new ErrorBoundary(error);
      return registerResult.registerResult();
    }
  }



  /**
   * middleware 
 * 驗證用戶已有的sessionID是否有資料再進行回傳
 * @returns {Promise.<object>}
 */
  ValidateSessionID = async (req) => {

    try {
      //先判斷有無sessionID

      if (req.session.sessionID) {
        const UserSessionData = await this.#userRepository.getSessionData(req.session.sessionID);
        //長度為0代表有ID查不到該筆用戶

        if (UserSessionData.length === 0) {
          return { status: 401, msg: UserSessionData };
        }
        return { status: 200, msg: JSON.parse(UserSessionData) };
      } else {
        return { status: 401, msg: [] }
      }
    } catch (error) {

      return { status: 204, msg: 'User Not Found', data: error };
    }
  }

  /**
   * 用戶ID用於刪除sessions資料
   * @param {number} user_id 
   */
  logout = async (user_id) => {
    const result = await this.#userRepository.deleteSessionData(user_id);
    if (result == 1) return { status: 204, msg: 'success' }
    return { status: 500, msg: 'Logout failed!' }
  }


}





/**
* 錯誤處理，處理Login、Register傳遞過來的查找結果進行錯誤判斷
*/
class ErrorBoundary {

  constructor(result) {
    this.result = result;
  }

  /**
   * 返回查詢處理結果
   * @returns {object} 返回查詢結果物件
   */
  loginResult() {
    const { user, password } = this.result;

    /**
     * hasProp 是否有用戶名稱屬性
     * passwordCheck 檢查用戶密碼正確性
     * result 查到已有用戶且密碼正確返回true
     */

    const checkResult = {
      hasProp: () => {
        if (user === undefined) {
          return false
        }
        return true
      },
      passwordCheck: () => user.user_password == password,
      result: () => {
        if (checkResult.hasProp()) {
          if (checkResult.passwordCheck()) {
            return true;
          }
        } else return false;
      }
    }

    if (checkResult.result()) {
      return { ...user, status: 200 };
    }
    else {
      return { status: 403, msg: '用戶名稱或密碼錯誤' };
    }
  }

  /**
  * 驗證註冊結果
  * @returns {object} 返回結果物件
  */
  registerResult() {
    const err = this.result;
    if (/name/i.test(err.sqlMessage)) {
      return { status: 403, msg: '名稱已被註冊過' };
    } else if (/mail/i.test(err.sqlMessage)) {
      return { status: 403, msg: '信箱已被註冊過' };
    } else if (/phone/i.test(err.sqlMessage)) {
      return { status: 403, msg: '電話已被註冊過' };
    }

  }


}
module.exports = AuthenticationService;