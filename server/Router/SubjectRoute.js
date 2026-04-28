const express = require("express");
const router = express.Router();
const subjectController = require("../Controllers/SubjectController");
const authMiddleware = require("../Middleware/AuthMiddleware");

// Public — used for the upload/filter dropdowns
router.get("/", subjectController.getSubjects);

// Admin — requires authentication and admin role
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