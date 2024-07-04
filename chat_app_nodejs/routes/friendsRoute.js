const express = require('express');
const router = express.Router();
const {send, search, cancel, accept, unfriend, page, load_request} = require("../controllers/friendsController");

// [GET] /search
router.get("/search", search);

// [GET] /send
router.post("/send", send);

// [GET] /send
router.get("/page", page);load_request

router.delete('/cancel', cancel);

router.get('/load_request', load_request);

router.post('/accept', accept);

router.delete('/unfriend', unfriend);



module.exports = router;
