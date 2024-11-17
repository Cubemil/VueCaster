const express = require('express');
const router = express.Router();

/************************ IMPORT CONTROLLERS ************************/

const userController = require('../controllers/user');

/************************ HTTP ROUTE HANDLERS ************************/

// requests without userId
router.post('/user/signup', userController.signup);
router.get('/user/login', userController.login);

// single dataset requests
router.get('/user/:userId/profile', userController.profile);
router.put('/user/:userId/update', userController.updateUser);
router.delete('/user/:userId/delete', userController.deleteUser);

/************************ EXPORT ROUTES ************************/

module.exports = router;