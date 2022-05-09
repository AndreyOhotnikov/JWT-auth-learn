const ApiError = require('../exception/api-error')
const tokenService = require('../service/token-service')


module.exports = function (req, res, next) {
  try {
    const authotizationHeader = req.headers.authorization;
    if( !authotizationHeader) {
      return next(ApiError.unathorizedError())
    }
    const accessToken = authotizationHeader.split(' ')[1];
    if( !accessToken) {
      return next(ApiError.unathorizedError())
    }
    const userData = tokenService.validateAccessToken(accessToken);
    if( !userData) {
      return next(ApiError.unathorizedError())
    }
    req.user = userData;
    next()
  } catch (error) {
    return next(ApiError.unathorizedError());
  }
}
