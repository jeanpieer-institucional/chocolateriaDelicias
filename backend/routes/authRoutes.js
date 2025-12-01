const express = require('express');
const router = express.Router();
const { register, login, updateProfile, changePassword, uploadProfilePicture } = require('../controllers/authController');
const auth = require('../middleware/auth');
const upload = require('../config/multer');

router.post('/register', register);
router.post('/login', login);
router.put('/profile', auth, updateProfile);
router.put('/password', auth, changePassword);
router.post('/profile-picture', auth, upload.single('image'), uploadProfilePicture);

module.exports = router;
