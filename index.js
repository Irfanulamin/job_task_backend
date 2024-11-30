const express = require("express");
const cors = require("cors");
const { connectDB } = require("./src/utils/mongodb");
const packageRoutes = require("./src/routes/packagesRouter");

require("dotenv").config();

const app = express();
const port = process.env.PORT ?? 3000;

const corsOptions = {
  origin: "*",
  methods: "GET,POST,PUT,PATCH,DELETE",
};

app.use(cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
connectDB();

// API Routes
app.use("/", packageRoutes);

app.get("/", (req, res) => {
  return res
    .status(200)
    .send({ response: "world", success: true, timestamp: new Date() });
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
