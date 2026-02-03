const express = require('express');
const router = express.Router();
const controller = require('./controller');
const { verifyToken } = require('../../middleware/auth');

router.use(verifyToken);

router.get('/', controller.getAll);
router.get('/stats', controller.getStats);
router.get('/:id', controller.getById);
router.post('/', controller.create);
router.post('/generate-pdf', controller.generatePDF);
router.get('/download-pdf/:filename', controller.downloadPDF);


module.exports = router;
