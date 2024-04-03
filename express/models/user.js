/**
 * @import 用戶SQL語法查詢字串
 */
const userQuery = require('../sql_query/user.constant');

/**
 * @File 引入格式化函數
 */
const { formatDateTime } = require('../utils/formatting');

const dbConn = require('../mysql/index');
/**
* 註冊用戶資料
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
 * 
 * @interface IUserRepository
 */
class IUserRepository {

  connectDB() {
    return this.conn = dbConn;
  }

  /**
   * 獲取用戶資料
   * @param {string} username 
   * @param {string} sessionID 
   * @returns {Promise.<object>} 查詢用戶資料結果
   */
  async getUser(username, sessionID) {
  }

  /**
 * 註冊新用戶
 *
 * @param {UserData} userData 用戶數據對象
 * @return {Promise.<object>} 返回註冊結果
 */
  async createUser(userData) {
  }

  /**
 * 更新用戶個人資料
 * @param {object} userInfo 用戶所需更新的資料
 * @param {string} sessionID 用戶sessionID
 * @returns {Promise.<object>} 更新結果物件
 */
  async edit(userInfo, sessionID) {
  }

  /**
 * 根據已有的sessionID去查詢用戶資料
 * @param {string} sid 用戶sessionID 
 * @returns {Promise.<object>} 用戶詳細物件
 */
  async getSessionData(sid) {

  }

  /**
   * 分頁查詢
   * @param {number} page 查詢頁數
   * @param {number} per_page 每頁數量
   */
  async browse(page, per_page) {

  }

  /**
   * 查詢總長度
   */
  async getLength() {

  }

  /**
   * 更新用戶所有資料
   * @param {object} userInfo 
   * @param {object} newUserInfo 用戶新資料
   */
  async update(userInfo, newUserInfo) {

  }

  /**
   * 清空用戶session資料
   * @param {number} userID 
   */
  async deleteSessionData(userID) {

  }
}


/**
 * 用戶資料庫
 * @extends IUserRepository
 */
class UserRepository extends IUserRepository {

  constructor() {
    super();
    this.connectDB();
  }

  async getLength() {
    return new Promise((resolve, reject) => {
      this.conn.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(`SELECT COUNT(*) FROM user`, (err, row) => {
          if (err) {
            reject(err);
            conn.release();
            return
          }

          resolve(row[0]);
          conn.release();
          return;

        })
      })
    })
  }

  async browse(page, per_page) {
    return new Promise((resolve, reject) => {
      this.conn.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(userQuery.browseUserData, [page, per_page], (err, row) => {
          if (err) {
            reject(err);
            conn.release();
            return
          }

          resolve(row);
          conn.release();
          return;

        })
      })
    })
  }


  getUser = async (username, sessionID) => {
    // 與資料庫交互取得使用者
    return new Promise((resolve, reject) => {
      //查詢用戶登入是否存在
      this.conn.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(userQuery.getUserData, [username], (err, row) => {
          if (err) {
            reject(err);
            conn.release();
          } else {
            if (row[0] === undefined) {

              resolve(row[0]);
              conn.release();
              return
            }
            //設置sessionID登入、過期時間
            let { formattedDate, formattedExpiresDate } = formatDateTime();
            let convertUID = Buffer.from(row[0].uuid);
            const stringUID = convertUID.toString('utf8');
            row[0].uuid = stringUID;
            // @ts-ignore
            const userInfo = { ...row[0], lastTimeLogin: formattedDate };
            resolve(userInfo);
            //登入後將用戶資料插入session DB
            const insertSession = new UserSession(this.conn);
            insertSession.setSession(userInfo, sessionID, formattedDate, formattedExpiresDate);
          }
          return;
        })
      })

    })
  }


  createUser = async (userData) => {

    return new Promise((resolve, reject) => {

      const { name, department, age, confirmPassword, email, gender, phone, uuid } = userData;
      this.conn.getConnection((err, conn) => {

        if (err) {

          throw err
        };
        conn.query(userQuery.createUserData, [name, department, email, confirmPassword, phone, gender, age, uuid], (err) => {
          if (err) {

            reject(err);
          } else {

            resolve(true);
          }

          conn.release();
        })
      })

    })
  }


  edit = async (updateUserData, sessionID) => {
    try {
      const userSession = new UserSession(this.conn);
      const sessionData = await userSession.getSession(sessionID);
      const updateData = { ...JSON.parse(sessionData), ...updateUserData };

      const result = await userSession.updateSession(updateUserData);
      userSession.setSession(updateData, sessionID);
      return result;
    } catch (error) {
      return error;
    }
  }

  read = async (user_id) => {
    return new Promise((resolve, reject) => {
      this.conn.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(`select data from sessions where user_id=?`, [user_id], (err, row) => {
          if (err) {
            reject(err);
            conn.release();
            return;
          }

          resolve({ ...row[0] });
          conn.release();
          return;
        })
      })
    })
  }

  delete = async (user_id) => {
    return new Promise((resolve, reject) => {
      this.conn.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(`delete from user where user_id=?`, [user_id], (err, row) => {
          if (err) {
            reject(err);
            conn.release();
            return;
          }
          resolve('success');
          conn.release();
          return;
        })
      })
    })
  }

  update = async (userInfo, newUserInfo) => {

    const { user_id, role_uid } = userInfo;
    const role = {
      1: 'editor',
      2: 'visitor'
    };

    const { queryParams, queryProps } = queryHandler(userInfo);
    const { formattedDate } = formatDateTime();

    return new Promise((resolve, reject) => {
      this.conn.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(`update user join sessions on user.user_id = sessions.user_id join role on user.user_id = role.user_id set ${queryProps},sessions.data=?,sessions.updated_at=?,role.role_uid=?,role.role_name=? where user.user_id=?`, [...queryParams, newUserInfo, formattedDate, role_uid, role[role_uid], user_id], (err, row) => {
          if (err) {

            reject(err);
            conn.release();
            return;
          }

          resolve('success');
          conn.release();
          return;
        })
      })
    })
  }

  getSessionData = async (sid) => {
    try {
      const userSession = new UserSession(this.conn);
      const SessionData = await userSession.getSession(sid);
      return SessionData;
    } catch (error) {
      return error
    }
  }

  deleteSessionData = async (userID) => {
    try {
      const userSession = new UserSession(this.conn);
      const result = await userSession.deleteSession(userID);
      return result;
    } catch (error) {

      return error
    }
  }
}




class IUserSession {

  /**
   * 登入後設置用戶sessionID數據
   * @param {object} userInfo 用戶詳細資料
   * @param {string} sessionID 用戶sessionID
   * @param {string} formattedDate 格式化後當前時間 
   * @param {string} formattedExpiresDate 格式化後延後2小時時間 
   */
  setSession(userInfo, sessionID, formattedDate = "", formattedExpiresDate = "") {
  }

  /**
   * 根據已有的sessionID獲取用戶的數據
   * @param {string} sid 
   */
  getSession(sid) {

  }

  /**
   * 更新用戶sessionID資料
 * @param {object} userInfo
 */
  updateSession(userInfo) {

  }

  /**
   * 刪除用戶根據已有的sessionID數據資料
 * @param {number} userID
 */
  deleteSession(userID) {

  }
}




/**
 *  新增、更新SessionID
 */
class UserSession extends IUserSession {
  constructor(db) {
    super();
    this.conn = db;
  }

  setSession = (userInfo, sessionID, formattedDateTime = "", formattedExpiresDate = "") => {

    let queryProps;
    let queryParams;
    if (formattedDateTime && formattedExpiresDate) {
      //登入動作
      queryProps = `sid=?,data=?,created_at=?,expires=?`;
      queryParams = [sessionID, JSON.stringify(userInfo), formattedDateTime, formattedExpiresDate];
    } else {
      //更新動作
      queryProps = `sid=?,data=?`;
      queryParams = [sessionID, JSON.stringify(userInfo)];
    }

    this.conn.getConnection((err, conn) => {
      if (err) throw err;
      conn.query(`UPDATE sessions SET ${queryProps} WHERE user_id=?`, [...queryParams, userInfo.user_id], (err) => {
        if (err) {
          throw new Error("Setting Session Fail.");
        }
        conn.release();
      })
    })


  }


  getSession = (sid) => {

    return new Promise((resolve, reject) => {
      this.conn.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(`SELECT data,updated_at as lastTimeUpdate FROM sessions WHERE sid='${sid}'`, (err, row) => {

          if (!row.length) {
            reject({});
            conn.release();
            return
          }

          const data = JSON.parse(row[0].data);
          const lastTimeUpdate = row[0].lastTimeUpdate;
          const stringify = JSON.stringify({ ...data, lastTimeUpdate });
          //@ts-ignore
          resolve(stringify);
          conn.release();
          return
        })
      })

    })

  }


  updateSession = async (userInfo) => {

    return new Promise((resolve, reject) => {
      this.conn.getConnection((err, conn) => {

        if (err) throw err;
        //保存用戶編輯
        const { user_id } = userInfo;

        const { formattedDate } = formatDateTime();
        //自動化參數
        const { queryProps, queryParams } = queryHandler(userInfo);


        conn.query(`UPDATE user join sessions as ses on ses.user_id=user.user_id set ${queryProps},ses.updated_at=? where user.user_id=?`, [...queryParams, formattedDate, user_id], (err, row) => {
          if (err) {
            reject({ status: 409, msg: ' error' });

            conn.release();
            return
          }

          resolve({ status: 200, msg: ' success' });
          conn.release();
        })

      })

    })
  }

  deleteSession(userID) {
    return new Promise((resolve, reject) => {
      this.conn.getConnection((err, conn) => {
        if (err) throw err;
        conn.query(`update sessions set sid=?,data=?,expires=? WHERE user_id=?`, [null, null, null, userID], (err, row) => {
          if (err) {
            reject(err);
            conn.release();
            return
          }
          resolve(1);
          conn.release();
          return
        })
      })

    })
  }


}
function queryHandler(body) {
  //將請求體自動化成sql參數
  const bodyEntries = new Map(Object.entries(body));
  const arr = [];
  const queryParams = [];
  bodyEntries.forEach((value, key, map) => {
    if (key == 'user_id' || key == 'role_uid') return;
    arr.push(`${key}=?`);
    queryParams.push(value);
  })
  const queryProps = arr.toString();
  return { queryProps, queryParams };

}



module.exports = UserRepository;