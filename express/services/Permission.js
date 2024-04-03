


class User {


  getFile() {
  }
  accessFile() {
  }

}

class PermissionMiddler {
  constructor(Authentication) {
    this.user = Authentication;
  }
  /**
   * @param {string} user 接受使用者的角色(editor、visitor)
   * @returns {Boolean} 返回編輯身份，true可編輯、false無法
   */
  permissionChecker(user) {
    const role = {
      editor: true,
      visitor: false
    }
    return role[user]
  }



}




class Admin extends User {

  constructor(UserData) {
    super()
    this.userData = UserData;

  }
  getFile() {

  }
  getUser(id) {

  }
  deleteUser(id) {

  }

  createUser(userDetails) {

  }

  deletedFile(id) {

  }
  accessFile(id) {

  }
  uploadFile(file) {

  }
  createFile(file) {

  }
  editFile(id) {

  }

}

class RegularUser extends User {

  constructor(UserData) {
    super()
    this.userData = UserData;

  }

  getFile() {

  }

  accessFile(id) {

  }

}




