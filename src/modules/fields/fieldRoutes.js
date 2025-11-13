const router = require('express').Router();
const multer = require('multer');
const auth = require('../../middleware/authMiddleware');
const controller = require('./fieldController');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 2 * 1024 * 1024 }
});

router.get('/', controller.list);
router.get('/:id', controller.show);
router.get('/:id/availability', controller.availability);
router.post('/', auth, upload.single('imagen'), controller.create);
router.put('/:id', auth, upload.single('imagen'), controller.update);
router.delete('/:id', auth, controller.remove);

module.exports = router;
