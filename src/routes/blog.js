const express = require("express");
const { body } = require("express-validator");

const router = express.Router();

const blogController = require("../controllers/blog");

// endpoint -> [POST] : /v1/blog/post
router.post(
   "/post",
   [
      body("title")
         .isLength({ min: 5 })
         .withMessage("Panjang Title minimal 5 karakter!"),
      body("body")
         .isLength({ min: 5 })
         .withMessage("Panjang Body minimal 5 karakter!"),
   ],
   blogController.createBlogPost
);

// endpoint -> [GET] : /v1/blog/posts
router.get("/posts", blogController.getAllBlogPost); // query parameter (?)
router.get("/post/:_id", blogController.getBlogPostById);

// endpoint -> [PUT] : /v1/blog/post
router.put(
   "/post/:_id",
   [
      body("title")
         .isLength({ min: 5 })
         .withMessage("Panjang Title minimal 5 karakter!"),
      body("body")
         .isLength({ min: 5 })
         .withMessage("Panjang Body minimal 5 karakter!"),
   ],
   blogController.updateBlogPost
);

// endpoint -> [DELETE] : /v1/blog/post
router.delete("/post/:_id", blogController.deleteBlogPost);

module.exports = router;
