const express = require('express');
const router = express.Router();
const videoController = require('../controllers/video.controller')
router.post('/video', videoController.postVideo);
router.post('/picture', videoController.postPicture);

module.exports = router;
