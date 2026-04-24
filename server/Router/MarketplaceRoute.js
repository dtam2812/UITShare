const express = require("express");
const router = express.Router();
const marketplaceController = require("../Controllers/MarketplaceController");
const authMiddleware = require("../Middleware/AuthMiddleware");

router.post(
  "/buy",
  authMiddleware.isAuthentication,
  marketplaceController.buyDocument,
);
router.post(
  "/cancel",
  authMiddleware.isAuthentication,
  marketplaceController.cancelListing,
);
router.post(
  "/transfer",
  authMiddleware.isAuthentication,
  marketplaceController.transferNFT,
);
router.get(
  "/access/:documentId",
  authMiddleware.isAuthentication,
  marketplaceController.checkAccess,
);
router.post(
  "/donate",
  authMiddleware.isAuthentication,
  marketplaceController.donateToAuthor,
);

router.post(
  "/list",
  authMiddleware.isAuthentication,
  marketplaceController.resellDocument,
);

router.get(
  "/donate/received",
  authMiddleware.isAuthentication,
  marketplaceController.getDonationsReceived,
);

router.get(
  "/purchased",
  authMiddleware.isAuthentication,
  marketplaceController.getPurchasedDocuments,
);

router.get(
  "/author/:authorId/resell",
  marketplaceController.getAuthorResellListings,
);

module.exports = router;
