const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto')

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
      
      const userDto = new UserDto(user);
      const token = tokenService.generateTokens({...userDto})
      await tokenService.saveToken(userDto.id, token.refreshToken);

      return { ...token, user: userDto }
    }
}

module.exports = new UserService();
