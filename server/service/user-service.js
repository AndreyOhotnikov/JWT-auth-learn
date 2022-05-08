const UserModel = require('../models/user-model')
const bcrypt = require('bcrypt')
const mailService = require('./mail-service');
const tokenService = require('./token-service');
const UserDto = require('../dtos/user-dto')
const uuid = require('uuid')
const ApiError = require('../exception/api-error')


class UserService {
    async registration (email, password) {
      const candidate = await UserModel.findOne({email})
      if (candidate) {
        throw ApiError.BadRequest(`Пользователь с таким email: ${email} уже существует`)
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
        throw new ApiError.BadRequest('Некорректная ссылка активации')
      }
      user.isActivated = true;
      await user.save()

    }

    async login(email, password) {
      const user = await UserModel.findOne({email});
      if (!user) {
        throw new ApiError.BadRequest('Пользователь с таким email не найден');
      }
      console.log('55555555555555555555555555555555555555555555555555555', user.email)
      const isPassEquals = await bcrypt.compare(password, user.password);
      if (!isPassEquals) {
        throw new ApiError.BadRequest('Неверный пароль');
      }
      const userDto = new UserDto(user);
      const token = tokenService.generateTokens({...userDto});
      await tokenService.saveToken(userDto.id, token.refreshToken);

      return { ...token, user: userDto }
    }
}

module.exports = new UserService();
