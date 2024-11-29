const express = require("express");
const cors = require("cors");
require("dotenv").config();
const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri = `mongodb+srv://${process.env.MONGODB_ADMIN}:${process.env.MONGODB_PASS}@cluster0.femzxoy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const apiCollection = client.db("Backendtest").collection("api");

async function run() {
  try {
    await client.connect();
    await client.db("admin").command({ ping: 1 });

    // CREATE OPERATION
    app.post("/create-package", async (req, res) => {
      try {
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
    });

    // UPDATE OPERATION
    app.put("/update-package/:id", async (req, res) => {
      try {
        const id = req.params.id;
        const filter = { _id: new ObjectId(id) };
        const { title, description } = req.body;

        if (!title || !description) {
          return res.status(400).json({
            STATUS: "FAIL",
            MESSAGE: "Title and description are required",
            ERROR: "Invalid input",
            DATA: null,
          });
        }

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
    });

    // GET OPERATION
    app.get("/packages", async (req, res) => {
      try {
        // Fetch all packages from the database
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
    });

    // GET BY ID
    app.get("/packages/:id", async (req, res) => {
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
    });
  } finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ response: "world", success: true, timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
