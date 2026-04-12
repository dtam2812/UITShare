const userModel = require("../Models/UserModel");
const commentModel = require("../Models/CommentModel");
const documentModel = require("../Models/DocumentModel");

const getAuthorDetail = async (req, res) => {
  try {
    const { authorId } = req.params;

    const author = await userModel
      .findById(authorId)
      .select(
        "userName email avatar coverImage walletAddress studentId bio facebookLink createdAt",
      );

    if (!author) {
      return res.status(404).json({ message: "Không tìm thấy tác giả" });
    }

    const documents = await documentModel
      .find({ author: authorId, isMinted: true })
      .populate("author", "userName email avatar")
      .sort({ createdAt: -1 })
      .lean();

    const documentsWithStats = await Promise.all(
      documents.map(async (doc) => {
        const rootComments = await commentModel.find({
          document: doc._id,
          parentComment: null,
        });
        const ratedComments = rootComments.filter((c) => c.rating != null);
        const averageRating =
          ratedComments.length > 0
            ? Math.round(
                (ratedComments.reduce((sum, c) => sum + c.rating, 0) /
                  ratedComments.length) *
                  10,
              ) / 10
            : null;
        return { ...doc, commentCount: rootComments.length, averageRating };
      }),
    );

    const totalDownloads = documents.reduce(
      (sum, d) => sum + (d.downloadCount || 0),
      0,
    );
    const allRatings = documentsWithStats
      .filter((d) => d.averageRating != null)
      .map((d) => d.averageRating);
    const overallRating =
      allRatings.length > 0
        ? Math.round(
            (allRatings.reduce((a, b) => a + b, 0) / allRatings.length) * 10,
          ) / 10
        : null;

    return res.status(200).json({
      author,
      documents: documentsWithStats,
      stats: {
        totalDocs: documents.length,
        totalDownloads,
        overallRating,
      },
    });
  } catch (error) {
    console.error("[getAuthorDetail]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

module.exports = {
  getAuthorDetail,
};
