const CommentModel = require("../Models/CommentModel");
const DocumentModel = require("../Models/DocumentModel");

// GET /api/comments/:documentId
const getCommentsByDocument = async (req, res) => {
  try {
    const { documentId } = req.params;
    const comments = await CommentModel.find({
      document: documentId,
      parentComment: null,
    })
      .populate("user", "userName avatar")
      .sort({ createdAt: -1 });

    return res.status(200).json(comments);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

// POST /api/comments/:documentId
const createComment = async (req, res) => {
  try {
    const { documentId } = req.params;
    const { content, rating, parentComment } = req.body;
    const userId = req.userId;

    if (!content || content.trim() === "") {
      return res.status(400).json({ message: "Nội dung không được để trống" });
    }

    if (!parentComment && (!rating || rating < 1 || rating > 5)) {
      return res.status(400).json({ message: "Vui lòng chọn số sao đánh giá" });
    }

    const newComment = await CommentModel.create({
      user: userId,
      document: documentId,
      content: content.trim(),
      rating: parentComment ? null : rating,
      parentComment: parentComment || null,
    });

    const populated = await newComment.populate("user", "userName avatar");
    return res.status(201).json(populated);
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

// GET /api/comments/author/reviews  (cần isAuthentication)
// Lấy tất cả comments trên tài liệu của author đang đăng nhập
const getCommentsForAuthor = async (req, res) => {
  try {
    const userId = req.userId;

    const docs = await DocumentModel.find({ author: userId }, "_id title");
    const docIds = docs.map((d) => d._id);

    if (docIds.length === 0) {
      return res.status(200).json({ averageRating: 0, totalCount: 0, reviews: [] });
    }

    const comments = await CommentModel.find({
      document: { $in: docIds },
      parentComment: null,
      rating: { $ne: null },
    })
      .populate("user", "userName avatar")
      .populate("document", "title _id")
      .sort({ createdAt: -1 });

    const totalCount = comments.length;
    const averageRating =
      totalCount > 0
        ? Math.round(
            (comments.reduce((sum, c) => sum + (c.rating || 0), 0) / totalCount) * 10
          ) / 10
        : 0;

    return res.status(200).json({ averageRating, totalCount, reviews: comments });
  } catch (error) {
    return res.status(500).json({ message: "Lỗi server", error });
  }
};

module.exports = { getCommentsByDocument, createComment, getCommentsForAuthor };