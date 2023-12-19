const express = require("express");
const router = express.Router();

const {getAllPersons, getUser, createNewUser, updateUser, deleteUser} = require('../controller/userController.js')

router.get('/users',getAllPersons)
router.get('/users/:userId', getUser)
router.post('/users',createNewUser)
router.update('/users/:userId', updateUser)
router.delete('/users/:userId', deleteUser)

module.exports = router;