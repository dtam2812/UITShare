const subjectModel = require("../Models/SubjectModel");
 
const getSubjects = async (req, res) => {
  try {
    const subjects = await subjectModel
      .find()
      .sort({ _id: 1 })
      .lean();
 
    // Trả về dạng { id, name, category } để khớp với frontend
    const formatted = subjects.map((s) => ({
      id: s._id,
      name: s.name,
      category: s.category,
    }));
 
    return res.status(200).json(formatted);
  } catch (error) {
    console.error("[getSubjects]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};
 
module.exports = { getSubjects };
 