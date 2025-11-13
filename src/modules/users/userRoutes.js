const router = require('express').Router();
const authMiddleware = require('../../middleware/authMiddleware');
const userController = require('./userController');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/me', authMiddleware, userController.profile);
router.get('/', authMiddleware, userController.list); // admin listing
router.put('/:id', authMiddleware, userController.update);
router.delete('/:id', authMiddleware, userController.remove);

module.exports = router;
