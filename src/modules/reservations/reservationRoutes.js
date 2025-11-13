const router = require('express').Router();
const auth = require('../../middleware/authMiddleware');
const controller = require('./reservationController');

router.post('/', auth, controller.create);
router.get('/', auth, controller.list);
router.get('/mine', auth, controller.mine);
router.put('/:id/status', auth, controller.updateStatus);
router.put('/:id/cancel', auth, controller.cancel);

module.exports = router;
