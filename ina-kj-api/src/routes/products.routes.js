const express = require('express');
const ctrl = require('../controllers/products.controller');
const { authenticate, optionalAuth, requireRole } = require('../middleware/auth');

const router = express.Router();

router.get('/', optionalAuth, ctrl.list);
router.get('/:id', ctrl.getOne);
router.post('/', authenticate, requireRole('farmer'), ctrl.create);
router.patch('/:id', authenticate, requireRole('farmer', 'admin'), ctrl.update);
router.delete('/:id', authenticate, requireRole('farmer', 'admin'), ctrl.remove);

module.exports = router;
