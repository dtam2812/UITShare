const express = require("express");
const router = express.Router();
const documentController = require("../Controllers/DocumentController");
const authMiddleware = require("../Middleware/AuthMiddleware");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

const tempDir = "uploads/temp";
if (!fs.existsSync(tempDir)) {
  fs.mkdirSync(tempDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, tempDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}${ext}`);
  },
});

const upload = multer({ dest: "uploads/" });

router.get("/documentDetail/:documentId", documentController.getDocumentDetail);

router.delete(
  "/deleteDocument/:documentId",
  authMiddleware.isAuthentication,
  documentController.deleteDocument,
);

router.post(
  "/upload",
  authMiddleware.isAuthentication,
  upload.fields([
    { name: "file", maxCount: 1 },
    { name: "preview", maxCount: 1 },
  ]),
  documentController.uploadDocument,
);

router.get("/documentList", documentController.getListDocument);

module.exports = router;
