const Router = require('express').Router;
const userController = require('../controllers/user-controller')
const router = new Router();
const {body} = require('express-validator')
const authMiddliware = require('../middlewares/auth-middleware')

router.post('/registration',
  body('email').isEmail(),
  body('password').isLength({min: 3, max: 30}),
  userController.registration);
router.post('/login', userController.login);
router.post('/logout', userController.logout);

router.get('/activate/:link', userController.activation);
router.get('/refresh', userController.refresh);
router.get('/users', authMiddliware, userController.getUsers);


module.exports = router;
