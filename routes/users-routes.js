const express = require('express');
const { check } = require('express-validator');
const usersControllers = require('../controllers/users-controllers');
const checkAuth = require('../middleware/check-auth');
const router = express.Router();

router.get("/", usersControllers.getUsers);
router.post('/login', usersControllers.login);





router.use(checkAuth); // !!! EVERYTHING SAVE BELOW !!!

router.post("/signup",
[
  check('name')
    .not()
    .isEmpty(),
  check('email')
    .normalizeEmail()
    .isEmail(),
  check('password').isLength({ min: 6 })
],
usersControllers.signup
);

router.get("/:uid", usersControllers.getUserById);
router.delete("/:uid", usersControllers.deleteUser);


module.exports = router;
