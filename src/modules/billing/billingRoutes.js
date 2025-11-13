const router = require('express').Router();
const auth = require('../../middleware/authMiddleware');
const controller = require('./billingController');

router.get('/', auth, controller.listMine);
router.get('/admin', auth, controller.listAll);
router.get('/:reservationId', auth, controller.listByReservation);

module.exports = router;
