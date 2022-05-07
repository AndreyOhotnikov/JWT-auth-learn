const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto')
const uuid = require('uuid')

class UserService {
    async registration (email, password) {
      const candidate = await UserModel.findOne({email})
      if (candidate) {
        throw new Error(`Пользователь с таким email: ${email} уже существует`)
      }

      const hashPssword = await bcrypt.hash(password, 4);
      const activationLink = uuid.v4()

      const user = await UserModel.create({email, password: hashPssword, activationLink})
      await mailService.sendActivationMail(email, `${process.env.API_URL}/api/activate/${activationLink}`)  //////////////////
      
      const userDto = new UserDto(user);
      const token = tokenService.generateTokens({...userDto})
      await tokenService.saveToken(userDto.id, token.refreshToken);

      return { ...token, user: userDto }
    }

    async activate(activationLink) {
      const user = await UserModel.findOne({activationLink})
      if(!user) {
        throw new Error('Некорректная ссылка активации')
      }
      user.isActivated = true;
      await user.save()

    }
}

module.exports = new UserService();
