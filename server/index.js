const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const userRoutes = require("./routes/userRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
require("dotenv").config();

const app = express();
const PORT = 5000 || process.env.PORT;

app.use(express.json());
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
app.use(cors());
app.use("/api/users", userRoutes);
app.use('/api/employees', employeeRoutes);

mongoose
  .connect("mongodb://localhost:27017/DealsDray")
  .then(() => {
    app.listen(PORT, () => {
      console.log("Server Running at", PORT);
    });
  })
  .catch((err) => console.error(err));
