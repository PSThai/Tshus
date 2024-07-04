const express = require("express");
const router = express.Router();
const { search, join, get, page} = require("../controllers/conversationsController");

// Tìm kiếm cuộc trò chuyện của người dùng
router.get("/get", get);

// Lấy ra cuộc trò chuyện, phân trang dữ liệu
router.get("/page", page);

// Tìm kiếm cuộc trò chuyện của người dùng
router.get("/search", search);

// Lấy chi tiết cuộc trò chuyện
router.post("/join", join);

module.exports = router;
