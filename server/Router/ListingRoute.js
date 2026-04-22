const express = require("express");
const router = express.Router();
const listingController = require("../Controllers/ListingController");

router.get("/active/:documentId", listingController.getActiveListing);

module.exports = router;
