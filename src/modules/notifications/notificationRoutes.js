const router = require('express').Router();
const auth = require('../../middleware/authMiddleware');
const controller = require('./notificationController');

router.get('/', auth, controller.mine);
router.post('/test', auth, controller.test);

module.exports = router;
