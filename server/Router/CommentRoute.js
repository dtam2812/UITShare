const express = require("express");
const router = express.Router();
const {
  getCommentsByDocument,
  createComment,
  getCommentsForAuthor,
} = require("../Controllers/CommentController");
const { isAuthentication } = require("../Middleware/AuthMiddleware");

router.get("/author/reviews", isAuthentication, getCommentsForAuthor);

router.get("/:documentId", getCommentsByDocument);
router.post("/:documentId", isAuthentication, createComment);

module.exports = router;