const express = require('express');
const router = express.Router();
const {create} = require("../controllers/roomsControllers");

// POST
router.post("/create", create);

module.exports = router;
