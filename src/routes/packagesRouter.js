const express = require("express");
const router = express.Router();
const {
  createPackage,
  updatePackage,
  deletePackage,
  getPackages,
  getPackageById,
} = require("../controller/packages");

router.post("/create-package", createPackage);
router.put("/update-package/:id", updatePackage);
router.delete("/delete-package/:id", deletePackage);
router.get("/packages", getPackages);
router.get("/packages/:id", getPackageById);

module.exports = router;
