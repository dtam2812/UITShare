const express = require("express");
const router = express.Router();
const authorController = require("../Controllers/AuthorController");

router.get("/authorDetail/:authorId", authorController.getAuthorDetail);

module.exports = router;
