const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");

const app = express();

const fileStorage = multer.diskStorage({
   destination: (req, file, callback) => {
      callback(null, "images");
   },
   filename: (req, file, callback) => {
      callback(null, new Date().getTime() + "-" + file.originalname);
   },
});

const fileFilter = (req, file, callback) => {
   // filter
   if (
      file.mimetype === "image/png" ||
      file.mimetype === "image/jpg" ||
      file.mimetype === "image/jpeg"
   ) {
      callback(null, true);
   } else {
      callback(null, false);
   }
};

// middleware
app.use(bodyParser.json()); // type JSON
app.use("/images", express.static(path.join(__dirname, "images"))); // supaya images bisa diakses
app.use(multer({ storage: fileStorage, filter: fileFilter }).single("image"));

app.use((req, res, next) => {
   res.setHeader("Access-Control-Allow-Origin", "*");
   res.setHeader(
      "Access-Control-Allow-Methods",
      "GET, POST, PUT, PATCH, DELETE, OPTIONS"
   );
   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
   next();
});

app.use("/v1/auth", authRoutes);
app.use("/v1/blog", blogRoutes);

app.use((error, req, res, next) => {
   const status = error.errorStatus || 500;
   const message = error.message;
   const data = error.data;
   res.status(status).json({ message: message, data: data });
});

mongoose
   .connect(
      "mongodb+srv://agoengBani:PUbkr2L3sBILExyX@cluster0.fw4vcdm.mongodb.net/blog?retryWrites=true&w=majority&appName=Cluster0"
   )
   .then(() => {
      // jika sukses connect
      app.listen(4001, () => console.log("Connection Success"));
   })
   .catch((err) => console.log(err)); // jika gagal connect
