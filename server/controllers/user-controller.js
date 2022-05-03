const userService =- require('../service/user-service')

class UserController {
  async registration (req, res, next) {
    try {
      const {email, password} = req.body;
      const userData = await userService.registration(email, password)
    } catch (error) {
      
    }
  }

  async login (req, res, next) {
    try {
      
    } catch (error) {
      
    }
  }

  async logout (req, res, next) {
    try {
      
    } catch (error) {
      
    }
  }

  async refresh (req, res, next) {
    try {
      
    } catch (error) {
      
    }
  }

  async activation (req, res, next) {
    try {
      
    } catch (error) {
      
    }
  }

  async getUsers (req, res, next) {
    try {
      res.json(['5641', '682168'])
    } catch (error) {
      
    }
  }
}

module.exports = new UserController()
