const express = require("express");
const router = express.Router();
const subjectController = require("../Controllers/SubjectController");
const authMiddleware = require("../Middleware/AuthMiddleware");

// Public — dùng cho dropdown upload/filter
router.get("/", subjectController.getSubjects);

// Admin — yêu cầu xác thực + quyền admin
router.post(
  "/",
  authMiddleware.isAuthentication,
  authMiddleware.isAdmin,
  subjectController.createSubject
);

router.put(
  "/:id",
  authMiddleware.isAuthentication,
  authMiddleware.isAdmin,
  subjectController.updateSubject
);

router.delete(
  "/:id",
  authMiddleware.isAuthentication,
  authMiddleware.isAdmin,
  subjectController.deleteSubject
);

module.exports = router;