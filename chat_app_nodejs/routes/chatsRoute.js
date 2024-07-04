const express = require("express");
const router = express.Router();

const { join } = require("../controllers/chatsController");

router.post("/join", join);

module.exports = router;
