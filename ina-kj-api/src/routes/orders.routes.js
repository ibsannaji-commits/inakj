const express = require('express');
const ctrl = require('../controllers/orders.controller');
const { authenticate, requireRole } = require('../middleware/auth');

const router = express.Router();

router.use(authenticate);
router.post('/', requireRole('buyer'), ctrl.create);
router.get('/', ctrl.list);
router.get('/:id', ctrl.getOne);
router.patch('/:id/status', requireRole('farmer', 'admin'), ctrl.updateStatus);

module.exports = router;
