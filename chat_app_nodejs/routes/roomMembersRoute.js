const express = require('express');
const router = express.Router();
const {page, add, deletes} = require("../controllers/roomMembersController");


router.get('/page', page);
router.post('/add', add);
router.delete('/delete', deletes);

module.exports = router;
