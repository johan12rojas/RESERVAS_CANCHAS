const router = require('express').Router();
const auth = require('../../middleware/authMiddleware');
const controller = require('./paymentController');

router.post('/', auth, controller.pay);
router.get('/', auth, controller.mine);
router.get('/all', auth, controller.listAll);
router.get('/reservation/:reservationId', auth, controller.byReservation);

module.exports = router;
