const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const mailService = require('./mail-service')

class UserService {
    async registration (email, password) {
      const candidate = await UserModel.findOne({email})
      if (candidate) {
        throw new Error(`Пользователь с таким email: ${email} уже существует`)
      }
      const hashPssword = await bcrypt.hash(password, 4);
      const activtionLink = uuid.v4()
      const user = await UserModel.create({email, hashPssword, activtionLink})
      await mailService.sendActivationMail(email, activtionLink)  //////////////////
    }
}

module.exports = new UserService();
