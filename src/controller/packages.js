const { ObjectId } = require("mongodb");
const { apiCollection } = require("../utils/mongodb");

const createPackage = async (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        STATUS: "FAIL",
        MESSAGE: "Title and description are required",
        ERROR: "Invalid input",
        DATA: null,
      });
    }
    const createdPackageProduct = req.body;
    const result = await apiCollection.insertOne(createdPackageProduct);

    return res.status(200).json({
      STATUS: "OK",
      MESSAGE: "Package has been created!",
      ERROR: null,
      DATA: result,
    });
  } catch (error) {
    return res.status(500).json({
      STATUS: "ERROR",
      MESSAGE: "Failed to create package product.",
      ERROR: error.message,
      DATA: null,
    });
  }
};

const updatePackage = async (req, res) => {
  try {
    const id = req.params.id;
    const { title, description } = req.body;
    if (!title || !description) {
      return res.status(400).json({
        STATUS: "FAIL",
        MESSAGE: "Title and description are required",
        ERROR: "Invalid input",
        DATA: null,
      });
    }

    const filter = { _id: new ObjectId(id) };
    const result = await apiCollection.updateOne(filter, {
      $set: { title, description },
    });

    if (result.matchedCount === 0) {
      return res.status(404).json({
        STATUS: "FAIL",
        MESSAGE: "Package not found",
        ERROR: "Not found",
        DATA: null,
      });
    }

    return res.status(200).json({
      STATUS: "OK",
      MESSAGE: "Package has been updated!",
      ERROR: null,
      DATA: result,
    });
  } catch (error) {
    return res.status(500).json({
      STATUS: "ERROR",
      MESSAGE: "Failed to update package product.",
      ERROR: error.message,
      DATA: null,
    });
  }
};

const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const query = { _id: new ObjectId(id) };

    const result = await apiCollection.deleteOne(query);

    if (result.deletedCount === 0) {
      return res.status(404).json({
        STATUS: "FAIL",
        MESSAGE: "Package not found",
        ERROR: "Not found",
        DATA: null,
      });
    }

    return res.status(200).json({
      STATUS: "OK",
      MESSAGE: "Package has been deleted!",
      ERROR: null,
      DATA: result,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      STATUS: "ERROR",
      MESSAGE: "Failed to delete package product.",
      ERROR: error.message,
      DATA: null,
    });
  }
};

const getPackages = async (req, res) => {
  try {
    const packages = await apiCollection.find({}).toArray();

    if (packages.length === 0) {
      return res.status(404).json({
        STATUS: "FAIL",
        MESSAGE: "No packages found",
        ERROR: "Not Found",
        DATA: null,
      });
    }

    return res.status(200).json({
      STATUS: "OK",
      MESSAGE: "Packages fetched successfully!",
      ERROR: null,
      DATA: packages,
    });
  } catch (error) {
    return res.status(500).json({
      STATUS: "ERROR",
      MESSAGE: "Failed to fetch packages.",
      ERROR: error.message,
      DATA: null,
    });
  }
};

const getPackageById = async (req, res) => {
  try {
    const id = req.params.id;
    const query = { _id: new ObjectId(id) };

    const package = await apiCollection.findOne(query);

    if (!package) {
      return res.status(404).json({
        STATUS: "FAIL",
        MESSAGE: "Package not found",
        ERROR: "Not Found",
        DATA: null,
      });
    }

    return res.status(200).json({
      STATUS: "OK",
      MESSAGE: "Package fetched successfully!",
      ERROR: null,
      DATA: package,
    });
  } catch (error) {
    return res.status(500).json({
      STATUS: "ERROR",
      MESSAGE: "Failed to fetch package.",
      ERROR: error.message,
      DATA: null,
    });
  }
};

module.exports = {
  createPackage,
  updatePackage,
  deletePackage,
  getPackages,
  getPackageById,
};
