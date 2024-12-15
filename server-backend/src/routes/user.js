/************************ ROUTER SETUP ************************/

const express = require('express');
const router = express.Router();
const publicRouter = express.Router();
const protectedRouter = express.Router();

/************************ IMPORT CONTROLLERS ************************/

const userController = require('../controllers/user');

/************************ HTTP USER ROUTE HANDLERS ************************/

// public router: no auth required
publicRouter.post('/signup', userController.signup);
publicRouter.post('/login', userController.login);
publicRouter.get('/:userId/profile', userController.profile);

// protected router: auth required
protectedRouter.use(userController.authenticate); // call authenticate middleware for all routes
protectedRouter.delete('/delete', userController.deleteUser);
protectedRouter.get('/dashboard', userController.dashboard);
protectedRouter.put('/change-username', userController.changeUsername);
protectedRouter.put('/change-password', userController.changePassword);
protectedRouter.put('/change-email', userController.changeEmail);
protectedRouter.put('/change-profile-picture', userController.changeProfilePicture);
protectedRouter.delete('/delete', userController.deleteUser);

// testing token validation
router.get('/validate-token', userController.authenticate, userController.validateToken);

/************************ EXPORT ROUTES ************************/

router.use(publicRouter);
router.use(protectedRouter);

module.exports = router;
