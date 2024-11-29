const express = require('express')
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = 3000

app.use(cors());
app.use(express.json());

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.MONGODB_ADMIN}:${process.env.MONGODB_PASS}@cluster0.femzxoy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

const apiCollection = client.db("Backendtest").collection("api");

async function run() {
  try {
    
    await client.connect();
    await client.db("admin").command({ ping: 1 });
    
    app.post("/create-package", async (req, res) => {
        try {
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
  console.log(`Example app listening on port ${port}`)
})