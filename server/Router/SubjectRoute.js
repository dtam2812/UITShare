const express = require("express");
const router = express.Router();
const subjectController = require("../Controllers/SubjectController");

router.get("/", subjectController.getSubjects);

module.exports = router;