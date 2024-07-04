const express = require('express')
const router = express.Router();
const { get, find, update } = require("../controllers/usersController");

router.get("/get", get);
router.get("/find", find);
router.put("/update", update);

module.exports = router;
