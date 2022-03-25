const express = require('express');
const {check} = require('express-validator'); // for signup validation
const postsControllers = require('../controllers/posts-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();
const fileUpload = require('../middleware/file-upload');

router.get('/', postsControllers.getPosts);
router.get('/:pid', postsControllers.getPostById);

router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!

router.post('/',
fileUpload.array('image',1),
[
    check('content').not().isEmpty(),
], postsControllers.createPost);

router.patch('/:pid', postsControllers.updatePost);
router.delete('/:pid', postsControllers.deletePost);


module.exports = router;