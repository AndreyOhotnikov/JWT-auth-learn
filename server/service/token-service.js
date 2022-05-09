const jwt = require('jsonwebtoken')
const tokenModels = require('../models/token-models')

class TokenService {
  generateTokens(payload) {
    const accessToken = jwt.sign(payload, process.env.JWT_ACCESS_SECRET_KEY, {expiresIn: '15m'})
    const refreshToken = jwt.sign(payload, process.env.JWT_REFRESH_SECRET_KEY, {expiresIn: '30d'})
    return {
      accessToken,
      refreshToken
    }
  }

  async saveToken(userId, refreshToken) {
    const tokenData = await tokenModels.findOne({user: userId})
    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save()
    }
    const token = await tokenModels.create({user: userId, refreshToken});
    return token;
  }

  async removeToken(refreshToken) {
    const tokenData = await tokenModels.deleteOne({refreshToken});
    return tokenData;
  }
}

module.exports = new TokenService();
