
/**
 * @file 用戶SQL語法查詢字串
 */


/**
 * 獲取使用者所有資料
 * 
 * @constant
 * @type {string}
 */
const getUserData = `SELECT user.\`user_id\`,\`user_name\`,\`user_mail\`,\`uuid\`,\`user_phone\`,\`user_password\`,\`user_sex\`,\`user_age\`,\`user_register_time\`,\`position_name\`,\`department_name\`,\`role_uid\`,user.\`position_id\`,\`updated_at\` as lastTimeUpdate FROM user JOIN role ON user.user_id=role.user_id JOIN departments_position ON user.position_id = departments_position.position_id
      JOIN departments ON departments_position.department_id = departments.department_id JOIN sessions as ses on ses.user_id=user.user_id WHERE user.user_name=?`;

/**
 * 創建使用者所有資料
 * 
 * @constant
 * @type {string}
 */
const createUserData = `INSERT INTO user(\`user_name\`,\`position_id\`,\`user_mail\`,\`user_password\`,\`user_phone\`,\`user_sex\`,\`user_age\`,\`uuid\`)  VALUES(?,?,?,?,?,?,?,?)`;

/**
 * 瀏覽所有用戶資料
 * @constant
 * @type {string}
 */
const browseUserData = `SELECT user.user_id,user.uuid,user_name,user_mail,user_phone,user_sex,user_age,user_password,user_register_time,user.position_id,
position_name,department_name,role_uid,created_at as lastTimeLogin,updated_at as lastTimeUpdate FROM user JOIN role on user.user_id=role.user_id JOIN departments_position as depart ON user.position_id = depart.position_id
JOIN departments ON depart.department_id = departments.department_id JOIN sessions as ses ON user.user_id=ses.user_id  WHERE user.user_id > 0
ORDER BY user.user_id asc
LIMIT ?,?;`;

module.exports = { getUserData, createUserData, browseUserData }


