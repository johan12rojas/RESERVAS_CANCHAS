const router = require('express').Router();
const auth = require('../../middleware/authMiddleware');
const controller = require('./taskController');

router.post('/', auth, controller.create);
router.get('/', auth, controller.list);
router.get('/mine', auth, controller.mine);
router.get('/mine/history', auth, controller.historyMine);
router.put('/:id/status', auth, controller.updateStatus);
router.put('/:id', auth, controller.update);
router.get('/:id/history', auth, controller.history);

module.exports = router;

