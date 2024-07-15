const { validationResult } = require("express-validator");
const path = require("path");
const fs = require("fs"); // file system (untuk delete)
const BlogPost = require("../models/blog");

// post
exports.createBlogPost = (req, res, next) => {
   const errors = validationResult(req);

   // error handling
   if (!errors.isEmpty()) {
      const err = new Error("Input value tidak sesuai"); // error.message
      err.errorStatus = 400; // error.status
      err.data = errors.array(); //error.data
      throw err;
   }

   if (!req.file) {
      const err = new Error("Image harud di upload"); // error.message
      err.errorStatus = 422; // error.status
      throw err;
   }

   // request
   const title = req.body.title;
   const image = req.file.path; // menerima url dari folder image
   const body = req.body.body;

   const Posting = new BlogPost({
      title: title,
      body: body,
      image: image,
      author: { uniq_id: 1, name: "Agung Syabani" },
   });

   // menyimpan ke database
   Posting.save()
      .then((result) => {
         // response
         res.status(201).json({
            message: "Create Blog Post Success",
            data: result,
         });
      })
      .catch((err) => {
         console.log("error: ", err);
      });
};

// get
exports.getAllBlogPost = (req, res, next) => {
   const currentPage = parseInt(req.query.page) || 1;
   const perPage = parseInt(req.query.perPage) || 4;
   let totalData;

   // panggil data dari db
   BlogPost.find()
      .countDocuments() // menghitung jumlah data yang dimiliki
      .then((count) => {
         totalData = count;
         return BlogPost.find()
            .skip((currentPage - 1) * perPage) // melewati beberapa data
            .limit(perPage); // membatasi jumlah data yang ditampilkan
      })
      .then((result) => {
         res.status(200).json({
            message: "Data Blog Post Berhasil dipanggil",
            data: result,
            total_data: totalData,
            per_page: perPage,
            current_page: currentPage,
            total_page: Math.ceil(totalData / perPage),
         });
      })
      .catch((err) => {
         next(err);
      });
};

// mengambil blog post berdasarkan id
exports.getBlogPostById = (req, res, next) => {
   const postId = req.params._id;
   BlogPost.findById(postId)
      .then((result) => {
         if (!result) {
            const error = new Error("Blog Post tidak ditemukan!");
            error.errorStatus = 404;
            throw error;
         }
         res.status(200).json({
            message: "Data Blog Post Berhasil dipanggil",
            data: result,
         });
      })
      .catch((err) => {
         next(err);
      });
};

// put (update)
exports.updateBlogPost = (req, res, next) => {
   const errors = validationResult(req);

   // error handling
   if (!errors.isEmpty()) {
      const err = new Error("Input value tidak sesuai"); // error.message
      err.errorStatus = 400; // error.status
      err.data = errors.array(); //error.data
      throw err;
   }

   if (!req.file) {
      const err = new Error("Image harud di upload"); // error.message
      err.errorStatus = 422; // error.status
      throw err;
   }

   // request
   const title = req.body.title;
   const image = req.file.path; // menerima url dari folder image
   const body = req.body.body;
   const postId = req.params._id;

   BlogPost.findById(postId)
      .then((post) => {
         if (!post) {
            const err = new Error("Blog Post tidak ditemukan!");
            err.errorStatus = 404;
            throw err;
         }

         post.title = title;
         post.body = body;
         post.image = image;

         return post.save();
      })
      .then((result) => {
         res.status(200).json({
            message: "Update Success",
            data: result,
         });
      })
      .catch((err) => {
         next(err);
      });
};

// delete
exports.deleteBlogPost = (req, res, next) => {
   const postId = req.params._id;

   BlogPost.findById(postId)
      .then((post) => {
         if (!post) {
            const err = new Error("Blog Post tidak ditemukan!");
            err.errorStatus = 404;
            throw err;
         }

         removeImage(post.image); // hapus image
         return BlogPost.findByIdAndDelete(postId); // hapus postingan
      })
      .then((result) => {
         res.status(200).json({
            message: "Hapus Blog Post Berhasil!",
            data: result,
         });
      })
      .catch((err) => {
         next(err);
      });
};

const removeImage = (filePath) => {
   console.log("filePath ", filePath);
   console.log("directory name: ", __dirname);

   // /home/keycaps/Code/belajar-MERN/mern-api/images/<nama_image>.jpg
   filePath = path.join(__dirname, "../../", filePath);
   fs.unlink(filePath, (err) => console.log(err)); // delete image
};
