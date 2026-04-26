const subjectModel = require("../Models/SubjectModel");

const getSubjects = async (req, res) => {
  try {
    const subjects = await subjectModel.find().sort({ _id: 1 }).lean();
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

const createSubject = async (req, res) => {
  try {
    const { _id, name, category } = req.body;
    if (!_id || !name || !category) {
      return res.status(400).json({ message: "Thiếu thông tin bắt buộc." });
    }
    const exists = await subjectModel.findById(_id.toUpperCase());
    if (exists) {
      return res.status(409).json({ message: `Mã môn "${_id}" đã tồn tại.` });
    }
    const subject = await subjectModel.create({
      _id: _id.toUpperCase(),
      name,
      category,
    });
    return res.status(201).json({ id: subject._id, name: subject.name, category: subject.category });
  } catch (error) {
    console.error("[createSubject]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

const updateSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category } = req.body;
    const updated = await subjectModel.findByIdAndUpdate(
      id,
      { name, category },
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: "Không tìm thấy môn học." });
    return res.status(200).json({ id: updated._id, name: updated.name, category: updated.category });
  } catch (error) {
    console.error("[updateSubject]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

const deleteSubject = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await subjectModel.findByIdAndDelete(id);
    if (!deleted) return res.status(404).json({ message: "Không tìm thấy môn học." });
    return res.status(200).json({ message: "Xóa thành công." });
  } catch (error) {
    console.error("[deleteSubject]", error);
    return res.status(500).json({ message: error.message || "Lỗi server" });
  }
};

module.exports = { getSubjects, createSubject, updateSubject, deleteSubject };